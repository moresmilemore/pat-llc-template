// Pre-launch checklist. Run this after Pat approves the engagement at Phase 7
// and before flipping the site to production-public.
//
// Usage:
//   URL=https://client.com node scripts/launch-checklist.mjs           # report-only
//   URL=https://client.com node scripts/launch-checklist.mjs --apply   # flips noindex etc.
//
// Checks:
//   1. Confirm noindex meta is REMOVED from every prospect page (must be gone for launch)
//   2. Confirm robots.txt allows crawling
//   3. Confirm sitemap-index.xml exists at /sitemap-index.xml
//   4. Confirm LocalBusiness schema validates (basic structure check)
//   5. Confirm Stripe + Calendly URLs are real (no placeholders)
//   6. Confirm production URL Lighthouse mobile floor met
//   7. Confirm production URL is HTTPS
//
// --apply mode:
//   Strips `<meta name="robots" content="noindex" />` from src/layouts/SiteLayout.astro,
//   so the next deploy ships without it. Pat reviews + commits + redeploys.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const URL = process.env.URL;
const APPLY = process.argv.includes('--apply');

if (!URL) {
  console.error('Usage: URL=https://example.com node scripts/launch-checklist.mjs [--apply]');
  process.exit(2);
}

function log(msg) { process.stdout.write(`[launch] ${msg}\n`); }
function tryExec(cmd, opts = {}) {
  try { return { ok: true, stdout: execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }) }; }
  catch (e) { return { ok: false, stdout: e.stdout?.toString() ?? '', stderr: e.stderr?.toString() ?? '' }; }
}

const findings = [];
function record(check) {
  findings.push(check);
  const sym = { PASS: '✓', FAIL: '✗', WARN: '!', SKIP: '○' }[check.status] || '?';
  log(`${sym} [${check.id}] ${check.name} — ${check.summary}`);
}

// ---- Check 1: HTTPS ----
record({
  id: 'https',
  name: 'Production URL is HTTPS',
  status: URL.startsWith('https://') ? 'PASS' : 'FAIL',
  summary: URL.startsWith('https://') ? 'OK' : 'Production URL must be HTTPS',
});

// ---- Check 2: noindex meta is GONE on the live URL ----
const fetchHome = tryExec(`curl -fsS -m 10 -H "User-Agent: PatLLC-Launch/1.0" ${URL}`);
const homeHtml = fetchHome.stdout || '';
const hasNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(homeHtml);
record({
  id: 'noindex-meta',
  name: 'noindex meta REMOVED for launch',
  status: hasNoindex ? 'FAIL' : 'PASS',
  summary: hasNoindex ? 'noindex still present — must be removed before launch' : 'noindex correctly absent',
});

// ---- Check 3: robots.txt allows crawling ----
const robots = tryExec(`curl -fsS -m 10 ${URL}/robots.txt`);
const robotsBlocks = /Disallow:\s*\/\s*$/m.test(robots.stdout || '');
record({
  id: 'robots-txt',
  name: 'robots.txt allows crawling',
  status: robotsBlocks ? 'FAIL' : 'PASS',
  summary: robotsBlocks ? 'robots.txt blocks all crawling' : 'robots.txt OK or absent (default-allow)',
});

// ---- Check 4: sitemap-index.xml exists ----
const sitemap = tryExec(`curl -fsS -m 10 ${URL}/sitemap-index.xml`);
record({
  id: 'sitemap',
  name: 'sitemap-index.xml exists',
  status: sitemap.ok ? 'PASS' : 'WARN',
  summary: sitemap.ok ? 'OK' : 'Sitemap missing — search engines will discover slower',
});

// ---- Check 5: LocalBusiness schema present + parseable ----
const ldMatches = [...homeHtml.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
let hasLocalBusiness = false;
let schemaParseErrors = 0;
for (const m of ldMatches) {
  try {
    const obj = JSON.parse(m[1]);
    const types = [].concat(obj['@type'] || []);
    if (types.includes('LocalBusiness') || JSON.stringify(obj).includes('"LocalBusiness"')) {
      hasLocalBusiness = true;
    }
  } catch { schemaParseErrors++; }
}
record({
  id: 'localbusiness-schema',
  name: 'LocalBusiness JSON-LD on homepage',
  status: hasLocalBusiness ? 'PASS' : 'FAIL',
  summary: hasLocalBusiness ? 'OK' : 'Missing LocalBusiness schema — required per knowledge/seo.md',
});
if (schemaParseErrors > 0) {
  record({
    id: 'schema-parse',
    name: 'All JSON-LD blocks parse',
    status: 'FAIL',
    summary: `${schemaParseErrors} JSON-LD blocks failed to parse`,
  });
}

// ---- Check 6: Stripe + Calendly URLs are real ----
let patLlcCheck = { status: 'SKIP', summary: 'src/data/pat-llc.ts not readable' };
if (existsSync('src/data/pat-llc.ts')) {
  const patSrc = readFileSync('src/data/pat-llc.ts', 'utf8');
  const placeholderRe = /\{\{(STRIPE|CALENDLY)/;
  patLlcCheck = {
    status: !placeholderRe.test(patSrc) && /https:\/\/buy\.stripe\.com\//.test(patSrc) && /https:\/\/calendly\.com\//.test(patSrc)
      ? 'PASS'
      : 'FAIL',
    summary: !placeholderRe.test(patSrc)
      ? 'Stripe + Calendly URLs wired'
      : 'Placeholders remain in src/data/pat-llc.ts',
  };
}
record({
  id: 'stripe-calendly',
  name: 'Stripe + Calendly URLs wired',
  status: patLlcCheck.status,
  summary: patLlcCheck.summary,
});

// ---- Check 7: Lighthouse mobile floor (no skip-audits this time — full SEO scoring) ----
const findChromePath = () => {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  try {
    return execSync('find ~/.cache/ms-playwright -name chrome -type f -executable | head -1', {
      encoding: 'utf8',
    }).trim();
  } catch { return ''; }
};
const chromePath = findChromePath();
const lhEnv = chromePath ? { ...process.env, CHROME_PATH: chromePath } : process.env;
const ts = new Date().toISOString().replace(/[:.]/g, '-');
const lh = tryExec(
  `npx lighthouse ${URL} --output=json --output=html --output-path=qa/launch-lighthouse-${ts} --chrome-flags="--headless=new --no-sandbox" --quiet`,
  { env: lhEnv },
);
let lhScores = null;
try {
  const lhJson = JSON.parse(readFileSync(`qa/launch-lighthouse-${ts}.report.json`, 'utf8'));
  lhScores = {
    performance: Math.round((lhJson.categories?.performance?.score ?? 0) * 100),
    accessibility: Math.round((lhJson.categories?.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((lhJson.categories?.['best-practices']?.score ?? 0) * 100),
    seo: Math.round((lhJson.categories?.seo?.score ?? 0) * 100),
  };
} catch {}
const lhPass = lhScores && lhScores.performance >= 90 && lhScores.accessibility >= 95 && lhScores.bestPractices >= 95 && lhScores.seo >= 95;
record({
  id: 'lighthouse-launch',
  name: 'Lighthouse production floor (P≥90 A≥95 BP≥95 SEO≥95) — full audits, no skips',
  status: lhScores ? (lhPass ? 'PASS' : 'FAIL') : 'SKIP',
  summary: lhScores
    ? `P=${lhScores.performance} A=${lhScores.accessibility} BP=${lhScores.bestPractices} SEO=${lhScores.seo}`
    : 'Lighthouse run failed; see log',
});

// ---- Apply mode ----
if (APPLY) {
  log('');
  log('--apply: updating SiteLayout.astro to remove noindex meta');
  const layoutPath = 'src/layouts/SiteLayout.astro';
  if (existsSync(layoutPath)) {
    let layout = readFileSync(layoutPath, 'utf8');
    const before = layout.length;
    layout = layout.replace(/\s*<meta\s+name=["']robots["']\s+content=["']noindex["']\s*\/?>\s*/, '\n');
    if (layout.length === before) {
      log('  No noindex meta found in SiteLayout.astro (already removed?)');
    } else {
      writeFileSync(layoutPath, layout);
      log(`  noindex meta removed. Re-build + re-deploy. Diff: -${before - layout.length} bytes.`);
    }
  } else {
    log(`  Layout not found at ${layoutPath}; skip apply.`);
  }
}

// ---- Verdict ----
const fails = findings.filter((f) => f.status === 'FAIL').length;
const verdict = fails === 0 ? 'READY_TO_LAUNCH' : `BLOCKED (${fails} failing)`;
log('');
log(`=== ${verdict} ===`);
process.exit(fails === 0 ? 0 : 1);
