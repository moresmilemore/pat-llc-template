// Fetches the client's existing site and extracts structured content.
// Output: research/scrape-{YYYY-MM-DD}.json — the seed file the researcher
// (Phase 0.5) verifies + enriches into the markdown research artifacts.
//
// Usage:
//   URL=https://existing-client.com node scripts/scrape-existing-site.mjs
//
// What it captures per page:
//   - URL, status, title, meta description, canonical, robots
//   - H1, H2 array
//   - body text (clean — script/style stripped, normalized whitespace)
//   - all internal links (for crawl)
//   - all external links
//   - phone numbers (tel: links + visible patterns)
//   - email addresses (mailto: links + visible patterns)
//   - addresses (heuristic: lines matching street + city + state + ZIP)
//   - schema.org JSON-LD blocks (parsed)
//   - images (src + alt)
//   - ALL forms detected
//
// Crawl scope:
//   Depth-limited BFS from the seed URL. Default: 25 pages, depth 3.
//   Stays within the seed origin. Skips anchors, mailto:, tel:, javascript:.
//   Respects robots.txt for the agent named in USER_AGENT.

import { writeFileSync, mkdirSync } from 'node:fs';

const SEED = process.env.URL;
if (!SEED) {
  console.error('Usage: URL=https://example.com node scripts/scrape-existing-site.mjs');
  process.exit(2);
}

const MAX_PAGES = parseInt(process.env.MAX_PAGES || '25', 10);
const MAX_DEPTH = parseInt(process.env.MAX_DEPTH || '3', 10);
const USER_AGENT = 'PatLLC-SiteScraper/1.0 (+https://patllc.example/scraper)';

const NOW = new Date();
const ISO_DATE = NOW.toISOString().slice(0, 10);

const seedUrl = new URL(SEED);
const origin = seedUrl.origin;

const seen = new Set();
const queue = [{ url: SEED, depth: 0 }];
const pages = [];

function log(msg) { process.stdout.write(`[scrape] ${msg}\n`); }

// Naive HTML parser using regex — chosen over DOMParser dep so the script has
// zero runtime deps. Good-enough for content extraction; not a security parser.
function extract(html, url) {
  const stripScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ');

  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
  const description = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)?.[1] || '';
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i)?.[1] || '';
  const robots = html.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i)?.[1] || '';
  const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)?.[1] || '';
  const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)?.[1] || '';

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) => stripTags(m[1]));
  const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) => stripTags(m[1]));

  const links = [];
  for (const m of html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    const href = m[1].trim();
    const text = stripTags(m[2]).slice(0, 200);
    links.push({ href, text });
  }

  const images = [];
  for (const m of html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)) {
    const src = m[1];
    const alt = m[0].match(/alt=["']([^"']*)["']/i)?.[1] || '';
    images.push({ src, alt });
  }

  // JSON-LD schema blocks
  const schemas = [];
  for (const m of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      schemas.push(JSON.parse(m[1]));
    } catch {
      schemas.push({ _parseError: true, _raw: m[1].slice(0, 500) });
    }
  }

  // Forms
  const forms = [];
  for (const m of html.matchAll(/<form[\s\S]*?<\/form>/gi)) {
    const formHtml = m[0];
    const action = formHtml.match(/action=["']([^"']*)["']/i)?.[1] || '';
    const method = formHtml.match(/method=["']([^"']*)["']/i)?.[1] || 'get';
    const fields = [...formHtml.matchAll(/<(input|textarea|select)[^>]*>/gi)].map((mm) => {
      const tag = mm[0];
      return {
        type: tag.match(/type=["']([^"']*)["']/i)?.[1] || '',
        name: tag.match(/name=["']([^"']*)["']/i)?.[1] || '',
        required: /\brequired\b/i.test(tag),
      };
    });
    forms.push({ action, method, fields });
  }

  // Body text (rough)
  const bodyText = stripTags(stripScripts).replace(/\s+/g, ' ').trim();

  // Phones (tel: + visible US patterns)
  const phonesFromTel = [...html.matchAll(/href=["']tel:([^"']+)["']/gi)].map((m) => m[1]);
  const phonesVisible = [...bodyText.matchAll(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g)].map((m) => m[0]);
  const phones = [...new Set([...phonesFromTel, ...phonesVisible])];

  // Emails
  const emailsFromMailto = [...html.matchAll(/href=["']mailto:([^"'?]+)/gi)].map((m) => m[1]);
  const emailsVisible = [...bodyText.matchAll(/[\w.+-]+@[\w-]+\.[\w.-]+/g)].map((m) => m[0]);
  const emails = [...new Set([...emailsFromMailto, ...emailsVisible])];

  // Address heuristic: looks for "###  Street, City, ST ZIP" patterns
  const addresses = [];
  const addressMatches = bodyText.matchAll(
    /(\d{1,6}\s+[\w\s.,'#&-]+?\s*,\s*[\w\s]+?,?\s*[A-Z]{2}\s+\d{5}(-\d{4})?)/g,
  );
  for (const m of addressMatches) addresses.push(m[1].trim());

  return {
    url,
    title,
    description,
    canonical,
    robots,
    ogTitle,
    ogImage,
    h1s,
    h2s,
    h3s,
    links,
    images,
    schemas,
    forms,
    phones,
    emails,
    addresses: [...new Set(addresses)],
    bodyTextChars: bodyText.length,
    bodyTextSample: bodyText.slice(0, 1500),
    bodyText,
  };
}

function stripTags(s) {
  return s
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeUrl(href, base) {
  try {
    const u = new URL(href, base);
    u.hash = '';
    if (u.pathname.endsWith('/') && u.pathname !== '/') u.pathname = u.pathname.slice(0, -1);
    return u.toString();
  } catch {
    return null;
  }
}

async function fetchPage(url) {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml' },
  });
  const status = res.status;
  const finalUrl = res.url;
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('text/html')) {
    return { status, finalUrl, html: '', skipped: 'non-html' };
  }
  const html = await res.text();
  return { status, finalUrl, html };
}

async function fetchRobots(originUrl) {
  try {
    const res = await fetch(`${originUrl}/robots.txt`, { headers: { 'user-agent': USER_AGENT } });
    if (res.ok) return await res.text();
  } catch {}
  return '';
}

async function main() {
  log(`Seed: ${SEED}`);
  log(`Origin: ${origin}, max pages: ${MAX_PAGES}, max depth: ${MAX_DEPTH}`);

  const robotsTxt = await fetchRobots(origin);
  log(`robots.txt fetched (${robotsTxt.length} chars)`);

  while (queue.length > 0 && pages.length < MAX_PAGES) {
    const { url, depth } = queue.shift();
    if (seen.has(url) || depth > MAX_DEPTH) continue;
    seen.add(url);

    process.stdout.write(`[scrape] ${pages.length + 1}/${MAX_PAGES} ${url} (d=${depth}) ... `);
    try {
      const { status, finalUrl, html, skipped } = await fetchPage(url);
      if (skipped) {
        process.stdout.write(`SKIP (${skipped})\n`);
        continue;
      }
      if (status >= 400) {
        process.stdout.write(`${status}\n`);
        pages.push({ url, status, error: 'http-error' });
        continue;
      }
      const data = extract(html, finalUrl);
      data.status = status;
      data.depth = depth;
      pages.push(data);
      process.stdout.write(`${status} ✓ (${data.h1s.length} h1, ${data.h2s.length} h2, ${data.links.length} links, ${data.forms.length} forms)\n`);

      // Enqueue same-origin links
      for (const link of data.links) {
        const u = normalizeUrl(link.href, finalUrl);
        if (!u) continue;
        if (!u.startsWith(origin)) continue;
        if (seen.has(u)) continue;
        if (/\.(pdf|jpg|jpeg|png|gif|webp|svg|mp4|zip)$/i.test(new URL(u).pathname)) continue;
        queue.push({ url: u, depth: depth + 1 });
      }
    } catch (err) {
      process.stdout.write(`ERROR: ${err.message}\n`);
      pages.push({ url, error: err.message });
    }
  }

  // Aggregate signals across all pages
  const allPhones = new Set();
  const allEmails = new Set();
  const allAddresses = new Set();
  const allSchemas = [];
  let totalH1 = 0;
  let totalForms = 0;
  for (const p of pages) {
    if (p.error) continue;
    p.phones?.forEach((x) => allPhones.add(x));
    p.emails?.forEach((x) => allEmails.add(x));
    p.addresses?.forEach((x) => allAddresses.add(x));
    p.schemas?.forEach((s) => allSchemas.push({ url: p.url, schema: s }));
    totalH1 += p.h1s?.length || 0;
    totalForms += p.forms?.length || 0;
  }

  const summary = {
    seed: SEED,
    origin,
    scrapedAt: NOW.toISOString(),
    pagesAttempted: pages.length,
    pagesOk: pages.filter((p) => p.status >= 200 && p.status < 400).length,
    pagesError: pages.filter((p) => p.error || p.status >= 400).length,
    aggregatedPhones: [...allPhones],
    aggregatedEmails: [...allEmails],
    aggregatedAddresses: [...allAddresses],
    schemaTypesFound: [
      ...new Set(allSchemas.flatMap((s) => extractSchemaTypes(s.schema))),
    ],
    totalH1Across: totalH1,
    totalFormsAcross: totalForms,
    hasLocalBusinessSchema: allSchemas.some((s) =>
      JSON.stringify(s.schema).includes('"LocalBusiness"'),
    ),
    hasReviewSchema: allSchemas.some((s) =>
      JSON.stringify(s.schema).includes('"Review"'),
    ),
    hasServiceSchema: allSchemas.some((s) =>
      JSON.stringify(s.schema).includes('"Service"'),
    ),
    robotsTxt,
  };

  function extractSchemaTypes(schema) {
    if (!schema) return [];
    if (Array.isArray(schema)) return schema.flatMap(extractSchemaTypes);
    if (typeof schema !== 'object') return [];
    const types = [];
    if (schema['@type']) types.push(...[].concat(schema['@type']));
    if (schema['@graph']) types.push(...extractSchemaTypes(schema['@graph']));
    return types;
  }

  mkdirSync('research', { recursive: true });
  const outPath = `research/scrape-${ISO_DATE}.json`;
  writeFileSync(
    outPath,
    JSON.stringify({ summary, pages, schemas: allSchemas }, null, 2),
  );

  log('');
  log(`=== Done ===`);
  log(`Pages scraped: ${summary.pagesOk}/${summary.pagesAttempted}`);
  log(`Phones: ${summary.aggregatedPhones.join(', ') || '(none)'}`);
  log(`Emails: ${summary.aggregatedEmails.join(', ') || '(none)'}`);
  log(`Addresses: ${summary.aggregatedAddresses.length}`);
  log(`Schema types: ${summary.schemaTypesFound.join(', ') || '(none)'}`);
  log(`LocalBusiness: ${summary.hasLocalBusinessSchema ? 'yes' : 'no'}`);
  log(`Forms found: ${summary.totalFormsAcross} across ${summary.pagesOk} pages`);
  log(`Output: ${outPath}`);
  log('');
  log('Next step: dispatch researcher for Phase 0.5 with this JSON in inputs.');
}

main().catch((err) => {
  console.error('Scraper failed:', err);
  process.exit(1);
});
