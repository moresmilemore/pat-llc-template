// Per-client engagement setup. Prompts for the 7 client tokens, fills
// `src/data/client.ts`, fills `PROJECT_BRIEF.md` §1, optionally creates a
// per-client git branch, and prints the kickoff prompt with tokens substituted —
// ready to paste into Claude Code.
//
// Usage:
//   node scripts/new-engagement.mjs
//   npm run new-engagement
//
// What changes (idempotent — safe to re-run):
//   - src/data/client.ts: 11 placeholders replaced with provided values
//   - PROJECT_BRIEF.md: §1 placeholders replaced
//   - prints kickoff text to stdout AND writes it to KICKOFF.engagement.md (gitignored
//     locally if you choose; commit if you want a record per client repo)
//
// What does NOT change:
//   - src/data/pat-llc.ts (Pat's master template; only Pat edits)
//   - src/data/services.ts (filled later by the orchestrator from research/)

import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = createInterface({ input, output });

function log(msg)  { process.stdout.write(`[new-engagement] ${msg}\n`); }
function warn(msg) { process.stderr.write(`[new-engagement] WARN: ${msg}\n`); }

async function ask(label, fallback = '') {
  const suffix = fallback ? ` [${fallback}]` : '';
  const v = (await rl.question(`  ${label}${suffix}: `)).trim();
  return v || fallback;
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function normalizePhone(raw) {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) return { display: `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`, tel: `+1${digits}`, sms: `+1${digits}` };
  if (digits.length === 11 && digits.startsWith('1')) return { display: `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`, tel: `+${digits}`, sms: `+${digits}` };
  return { display: raw, tel: raw, sms: raw };
}

async function main() {
  log('Pat LLC — new client engagement setup');
  log('Press Enter to accept defaults shown in [brackets].\n');

  const name = await ask('Client business name (e.g. "Acme Plumbing")');
  if (!name) { warn('Name is required.'); rl.close(); process.exit(2); }

  const slug = await ask('Client slug (URL-safe identifier)', slugify(name));
  const url = await ask('Existing site URL', 'https://example.com');
  const industry = await ask('Industry (e.g. "Plumbing", "HVAC", "Roofing")');
  const phoneRaw = await ask('Client phone number');
  const phone = normalizePhone(phoneRaw);
  const email = await ask('Client email');
  const street = await ask('Street address (optional)', '');
  const city = await ask('City', '');
  const region = await ask('State / Region (e.g. "IL")', '');
  const postal = await ask('ZIP / Postal code', '');
  const hours = await ask('Hours of operation', 'Mon–Fri 8am–5pm');
  const serviceArea = await ask('Service area phrase (e.g. "Greater Springfield, IL")');
  const license = await ask('License number (optional)', '');
  const insurance = await ask('Insurance / bonding (optional)', '');
  const reviewCountTarget = await ask('Review count TARGET for research harvest', '20');
  const gbpUrl = await ask('Google Business Profile URL (optional)', '');
  const reviewCount = await ask('Current review count (will be updated from research; enter 0 if unknown)', '0');
  const averageRating = await ask('Current average rating (0 if unknown)', '0');

  rl.close();

  // ---- Update src/data/client.ts ----
  const clientPath = 'src/data/client.ts';
  let clientSrc = readFileSync(clientPath, 'utf8');

  const clientReplacements = {
    '{{CLIENT_NAME}}': name,
    '{{CLIENT_SLUG}}': slug,
    '{{INDUSTRY}}': industry,
    '{{CLIENT_PHONE}}': phone.display,
    '{{CLIENT_PHONE_TEL}}': phone.tel,
    '{{CLIENT_PHONE_TEXT}}': phone.sms,
    '{{CLIENT_EMAIL}}': email,
    '{{CLIENT_STREET}}': street,
    '{{CLIENT_CITY}}': city,
    '{{CLIENT_REGION}}': region,
    '{{CLIENT_POSTAL}}': postal,
    '{{CLIENT_HOURS}}': hours,
    '{{SERVICE_AREA}}': serviceArea,
    '{{CLIENT_LICENSE}}': license,
    '{{CLIENT_INSURANCE}}': insurance,
    '{{CLIENT_URL}}': url,
    '{{GOOGLE_BUSINESS_PROFILE_URL}}': gbpUrl,
    '{{DEPLOYED_PROTOTYPE_URL}}': '',
  };

  for (const [k, v] of Object.entries(clientReplacements)) {
    clientSrc = clientSrc.split(k).join(v);
  }

  // Update reviewCount + averageRating literal
  clientSrc = clientSrc
    .replace(/reviewCount:\s*\d+/, `reviewCount: ${reviewCount}`)
    .replace(/averageRating:\s*\d+(\.\d+)?/, `averageRating: ${averageRating}`);

  writeFileSync(clientPath, clientSrc);
  log(`Updated ${clientPath}`);

  // ---- Update PROJECT_BRIEF.md ----
  const briefPath = 'PROJECT_BRIEF.md';
  let brief = readFileSync(briefPath, 'utf8');
  const briefReplacements = {
    '{{CLIENT_NAME}}': name,
    '{{OWNER_NAME}}': '[CLIENT_TBD]',
    '{{INDUSTRY}}': industry,
    '{{CLIENT_PHONE}}': phone.display,
    '{{CALL_OR_TEXT_OR_BOTH}}': '[CLIENT_TBD]',
    '{{CLIENT_EMAIL}}': email,
    '{{CLIENT_STREET}}': street,
    '{{CLIENT_CITY}}': city,
    '{{CLIENT_REGION}}': region,
    '{{CLIENT_POSTAL}}': postal,
    '{{CLIENT_HOURS}}': hours,
    '{{SERVICE_AREA}}': serviceArea,
    '{{CLIENT_URL}}': url,
    '{{CLIENT_LICENSE}}': license,
    '{{CLIENT_INSURANCE}}': insurance,
    '{{REVIEW_COUNT_TARGET}}': reviewCountTarget,
    '{{GOOGLE_BUSINESS_PROFILE_URL}}': gbpUrl,
  };
  for (const [k, v] of Object.entries(briefReplacements)) {
    brief = brief.split(k).join(v);
  }
  writeFileSync(briefPath, brief);
  log(`Updated ${briefPath}`);

  // ---- Generate kickoff with tokens substituted ----
  const kickoffPath = 'KICKOFF_PROMPT.md';
  const kickoffTemplate = readFileSync(kickoffPath, 'utf8');
  const kickoffReplacements = {
    '{{CLIENT_URL}}': url,
    '{{CLIENT_NAME}}': name,
    '{{CLIENT_PHONE}}': phone.display,
    '{{CLIENT_EMAIL}}': email,
    '{{SERVICE_AREA}}': serviceArea,
    '{{INDUSTRY}}': industry,
    '{{REVIEW_COUNT_TARGET}}': reviewCountTarget,
  };
  let kickoff = kickoffTemplate;
  for (const [k, v] of Object.entries(kickoffReplacements)) {
    kickoff = kickoff.split(k).join(v);
  }
  const kickoffOutPath = `KICKOFF.engagement.md`;
  writeFileSync(kickoffOutPath, kickoff);
  log(`Wrote engagement-specific kickoff to ${kickoffOutPath}`);

  // ---- Print next steps ----
  log('');
  log('=== Engagement scaffolded ===');
  log('');
  log(`Client: ${name} (slug: ${slug})`);
  log(`URL: ${url}`);
  log(`Industry: ${industry}`);
  log('');
  log('Next steps:');
  log('  1. Open PROJECT_BRIEF.md and fill any [CLIENT_TBD] sections');
  log(`  2. (Optional) Run: URL=${url} npm run scrape  — gives researcher a head start`);
  log(`  3. (Recommended) Create an engagement branch: git checkout -b client/${slug}`);
  log('  4. Open KICKOFF.engagement.md and paste its contents into Claude Code');
  log('  5. Walk away. The orchestrator runs phases 0 → 7 autonomously.');
  log('');
  log('At Phase 7, you review the approval packet at approval/' + slug + '-{date}.md');
}

main().catch((err) => {
  console.error('new-engagement failed:', err);
  process.exit(1);
});
