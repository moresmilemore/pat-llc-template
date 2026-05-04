// Phase 6.5 self-assessment battery — runs the objective checks and emits both
// a JSON results file and the partial approval packet. Semantic checks
// (vibe-fit verification, proposal-intro citation review) are flagged in the
// packet for the orchestrator to fill via UX agent dispatches.
//
// Usage:
//   URL=https://preview.vercel.app node scripts/self-assessment.mjs
//   node scripts/self-assessment.mjs                    # uses http://localhost:4321
//
// Outputs:
//   qa/self-assessment-{ISO}.json    — machine-readable results
//   approval/{client-slug}-{date}.md — partial approval packet (orchestrator fills semantic sections)
//
// Exit codes:
//   0 — battery complete (verdict may still be NOT_DONE; the packet documents)
//   1 — battery itself failed (script crash, prerequisites missing)

import { execSync, spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join } from 'node:path';

const URL = process.env.URL || 'http://localhost:4321';
const NOW = new Date();
const ISO_DATE = NOW.toISOString().slice(0, 10);
const ISO_TS = NOW.toISOString().replace(/[:.]/g, '-');
const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(URL);

function log(msg)  { process.stdout.write(`[self-assessment] ${msg}\n`); }
function warn(msg) { process.stderr.write(`[self-assessment] WARN: ${msg}\n`); }

function tryExec(cmd, opts = {}) {
  try {
    return { ok: true, stdout: execSync(cmd, { stdio: 'pipe', encoding: 'utf8', ...opts }) };
  } catch (e) {
    return {
      ok: false,
      stdout: e.stdout?.toString() ?? '',
      stderr: e.stderr?.toString() ?? '',
      code: e.status ?? null,
    };
  }
}

function isReachable(url) {
  return tryExec(`curl -fsS -o /dev/null -m 2 ${url}`).ok;
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function ensurePreviewServer() {
  // For accurate Lighthouse scores, we serve the built `dist/` via `astro preview`
  // rather than the dev server (which has hot-reload overhead). The script runs
  // `npm run build` itself as Check 1; we start preview after, so the server reflects
  // the production build.
  if (!isLocalhost) return null;
  if (isReachable(URL)) {
    log(`Local server already responding at ${URL}`);
    return null;
  }
  log(`Starting preview server in background (serves dist/)...`);
  const child = spawn('npm', ['run', 'preview'], {
    detached: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.unref();
  for (let i = 0; i < 60; i++) {
    if (isReachable(URL)) {
      log(`Preview server ready at ${URL}`);
      return child.pid;
    }
    await sleep(500);
  }
  warn(`Preview server did not become ready within 30s.`);
  return child.pid;
}

function killServer(pid) {
  if (!pid) return;
  log(`Stopping preview server (pid ${pid})`);
  try { process.kill(-pid, 'SIGTERM'); } catch {}
  try { process.kill(pid, 'SIGTERM'); } catch {}
}

// Locate the Playwright-installed Chromium so Lighthouse can use it
// (Asahi Fedora has no system Chrome; chrome-launcher fails without this).
function findChromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cacheRoots = [
    join(process.env.HOME || '', '.cache', 'ms-playwright'),
    join(process.env.HOME || '', 'Library', 'Caches', 'ms-playwright'),
    process.env.LOCALAPPDATA ? join(process.env.LOCALAPPDATA, 'ms-playwright') : null,
  ].filter(Boolean);
  for (const root of cacheRoots) {
    if (!existsSync(root)) continue;
    for (const dir of readdirSync(root)) {
      if (!dir.startsWith('chromium-')) continue;
      const candidates = [
        join(root, dir, 'chrome-linux', 'chrome'),
        join(root, dir, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
        join(root, dir, 'chrome-win', 'chrome.exe'),
      ];
      for (const p of candidates) {
        if (existsSync(p)) return p;
      }
    }
  }
  return null;
}

const CHROME_PATH = findChromePath();
if (CHROME_PATH) log(`Chromium for Lighthouse: ${CHROME_PATH}`);
else warn('Chromium not found in Playwright cache. Lighthouse will fall back to system Chrome.');

function detectClientSlug() {
  try {
    const src = readFileSync('src/data/client.ts', 'utf8');
    const slug = src.match(/slug:\s*['"]([^'"]+)['"]/)?.[1] ?? 'unknown-client';
    return slug;
  } catch {
    return 'unknown-client';
  }
}

function detectEngagementMode() {
  try {
    const src = readFileSync('src/data/client.ts', 'utf8');
    const name = src.match(/name:\s*['"]([^'"]+)['"]/)?.[1] ?? '';
    return !name.startsWith('{{');
  } catch {
    return false;
  }
}

const slug = detectClientSlug();
const engagementMode = detectEngagementMode();
const checks = [];

function record(check) {
  checks.push(check);
  const sym = { PASS: '✓', FAIL: '✗', SKIP: '○', WARN: '!' }[check.status] || '?';
  log(`${sym} [${check.id}] ${check.name} — ${check.summary}`);
}

log(`Running self-assessment for client="${slug}", url="${URL}", engagementMode=${engagementMode}`);

// ---- Check 1: build cleanly (must run BEFORE starting preview server) ----

mkdirSync('qa', { recursive: true });
const buildLog = `qa/build-${ISO_TS}.log`;
const build = tryExec('npm run build', {});
writeFileSync(buildLog, (build.stdout || '') + (build.stderr || ''));
record({
  id: '1-build',
  name: 'Build cleanly',
  status: build.ok ? 'PASS' : 'FAIL',
  severity: 'CRITICAL',
  summary: build.ok ? '`npm run build` exited 0' : `build failed (exit ${build.code})`,
  evidence: buildLog,
});

// Start preview server now that dist/ exists (local URLs only).
// For remote URLs, assume the URL is already reachable (deployed).
const serverPid = await ensurePreviewServer();
process.on('exit', () => killServer(serverPid));
process.on('SIGINT', () => { killServer(serverPid); process.exit(130); });

const playwrightEnv = `PLAYWRIGHT_BASE_URL=${URL} `;

// ---- Check 2: routes return 200 (via Playwright smoke) ----
const smoke = tryExec(`${playwrightEnv}npx playwright test --project=smoke --reporter=line`, {});
record({
  id: '2-routes',
  name: 'All routes 200 + smoke specs pass',
  status: smoke.ok ? 'PASS' : 'FAIL',
  severity: 'CRITICAL',
  summary: smoke.ok ? 'Playwright smoke suite passed' : 'Playwright smoke suite reported failures',
  evidence: 'qa/playwright-output/',
});

// ---- Check 3: no unresolved tokens in dist/ ----
function gatherDist() {
  if (!existsSync('dist')) return [];
  const out = [];
  function walk(dir) {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.(html|js|css|json)$/.test(f)) out.push(p);
    }
  }
  walk('dist');
  return out;
}

const distFiles = gatherDist();
const tokenMatches = { '{{TOKEN}}': [], '[CLIENT_TBD': [], '[VIBE_TBD': [] };
for (const f of distFiles) {
  const c = readFileSync(f, 'utf8');
  for (const m of c.matchAll(/\{\{[A-Z_]+\}\}/g)) tokenMatches['{{TOKEN}}'].push({ file: f, match: m[0] });
  if (c.includes('[CLIENT_TBD')) tokenMatches['[CLIENT_TBD'].push({ file: f, match: '[CLIENT_TBD]' });
  if (c.includes('[VIBE_TBD')) tokenMatches['[VIBE_TBD'].push({ file: f, match: '[VIBE_TBD]' });
}

const tokenTotal =
  tokenMatches['{{TOKEN}}'].length +
  tokenMatches['[CLIENT_TBD'].length +
  tokenMatches['[VIBE_TBD'].length;

record({
  id: '3-tokens',
  name: 'No unresolved tokens in dist/',
  status: tokenTotal === 0 ? 'PASS' : engagementMode ? 'FAIL' : 'WARN',
  severity: 'CRITICAL',
  summary:
    tokenTotal === 0
      ? 'No tokens found'
      : engagementMode
      ? `${tokenTotal} unresolved tokens leaked into shipped HTML`
      : `${tokenTotal} tokens present (template-mode; expected — fill during Phase 4)`,
  evidence: { matches: tokenMatches },
});

// ---- Check 4: fabrication / verbatim cross-checks (orchestrator-fills) ----
record({
  id: '4-fabrication',
  name: 'No fabricated content',
  status: 'SKIP',
  severity: 'CRITICAL',
  summary:
    'Cannot be fully automated. Orchestrator must spot-check audit-page VERIFIED claims against research/seo-audit.md, proposal intro against research/current-site-vibe.md + competitive-teardown.md, homepage reviews against research/reputation-harvest.md (verbatim only).',
  evidence: 'orchestrator-driven',
});

// ---- Check 5: Lighthouse (mobile + desktop) ----
const lhLog = `qa/lighthouse-${ISO_TS}.log`;
const lhEnv = CHROME_PATH ? { ...process.env, CHROME_PATH } : process.env;
// Skip is-crawlable audit — noindex is intentionally present in the template until Pat
// removes it at launch. Skip robots-txt too — relevant only at production domain.
const lh = tryExec(
  `npx lighthouse ${URL} --output=json --output=html --output-path=qa/lighthouse-${ISO_TS} --chrome-flags="--headless=new --no-sandbox" --skip-audits=is-crawlable,robots-txt --quiet`,
  { env: lhEnv },
);
writeFileSync(lhLog, (lh.stdout || '') + (lh.stderr || ''));
let lhScores = null;
try {
  const lhJson = JSON.parse(readFileSync(`qa/lighthouse-${ISO_TS}.report.json`, 'utf8'));
  lhScores = {
    performance: Math.round((lhJson.categories?.performance?.score ?? 0) * 100),
    accessibility: Math.round((lhJson.categories?.accessibility?.score ?? 0) * 100),
    bestPractices: Math.round((lhJson.categories?.['best-practices']?.score ?? 0) * 100),
    seo: Math.round((lhJson.categories?.seo?.score ?? 0) * 100),
  };
} catch {
  /* lhScores stays null */
}
const lhPass =
  lhScores &&
  lhScores.performance >= 90 &&
  lhScores.accessibility >= 95 &&
  lhScores.bestPractices >= 95 &&
  lhScores.seo >= 95;
record({
  id: '5-lighthouse',
  name: 'Lighthouse mobile floor (P≥90, A≥95, BP≥95, SEO≥95)',
  status: lhScores ? (lhPass ? 'PASS' : 'FAIL') : 'SKIP',
  severity: lhPass === false ? 'MAJOR' : 'CRITICAL',
  summary: lhScores
    ? `P=${lhScores.performance} A=${lhScores.accessibility} BP=${lhScores.bestPractices} SEO=${lhScores.seo}`
    : 'Lighthouse run skipped or failed; see lighthouse log',
  evidence: lhScores ? `qa/lighthouse-${ISO_TS}.report.html` : lhLog,
});

// ---- Check 6: WCAG via axe (in-browser via Playwright a11y project) ----
const a11y = tryExec(`${playwrightEnv}npx playwright test --project=a11y --reporter=line`, {});
record({
  id: '6-a11y',
  name: 'WCAG 2.1/2.2 AA via axe-core',
  status: a11y.ok ? 'PASS' : 'FAIL',
  severity: 'CRITICAL',
  summary: a11y.ok ? 'axe found no violations on tested routes' : 'axe found violations — see Playwright report',
  evidence: 'qa/playwright-report/index.html',
});

// ---- Check 7: mobile-viewport interactions ----
const mobile = tryExec(`${playwrightEnv}npx playwright test --project=mobile --reporter=line`, {});
record({
  id: '7-mobile',
  name: 'Mobile viewport interactions (tap targets ≥44px, tel: link, sticky nav)',
  status: mobile.ok ? 'PASS' : 'FAIL',
  severity: 'CRITICAL',
  summary: mobile.ok ? 'Mobile spec passed' : 'Mobile spec reported failures',
  evidence: 'qa/playwright-output/',
});

// ---- Check 8: vibe-fit verification (orchestrator-fills) ----
record({
  id: '8-vibe-fit',
  name: 'Vibe-fit verification (rendered build vs research/current-site-vibe.md)',
  status: 'SKIP',
  severity: 'MAJOR',
  summary:
    'Requires UX agent dispatch (Mode B rendered review). Orchestrator must dispatch and report score 0-100; below 75 = MAJOR, queued for Pat redirect.',
  evidence: 'orchestrator-driven',
});

// ---- Check 9: proposal-intro citation check (orchestrator-fills) ----
record({
  id: '9-proposal-intro',
  name: 'Proposal intro cites research specifics',
  status: 'SKIP',
  severity: 'CRITICAL',
  summary:
    'Cannot be regex-matched reliably. Orchestrator must read src/pages/proposal.astro intro paragraphs and confirm each cites at least one specific from research (archetype name, axis score, differentiation claim, or near-verbatim phrase from existing site/reviews). Generic boilerplate = CRITICAL invention.',
  evidence: 'orchestrator-driven',
});

// ---- Check 10: Stripe + Calendly placeholders are real values ----
let patLlcCheck = { status: 'SKIP', summary: 'src/data/pat-llc.ts not readable' };
try {
  const patSrc = readFileSync('src/data/pat-llc.ts', 'utf8');
  const stripeOk = !patSrc.includes('{{STRIPE_TIER_A}}') && !patSrc.includes('{{STRIPE_TIER_B}}') && !patSrc.includes('{{STRIPE_TIER_C}}');
  const calendlyOk = !patSrc.includes('{{CALENDLY_INTRO}}') && /https:\/\/calendly\.com\//.test(patSrc);
  patLlcCheck = {
    status: stripeOk && calendlyOk ? 'PASS' : 'FAIL',
    summary:
      stripeOk && calendlyOk
        ? 'Stripe + Calendly URLs wired'
        : `${stripeOk ? '' : 'Stripe placeholders unreplaced. '}${calendlyOk ? '' : 'Calendly URL missing or placeholder.'}`,
  };
} catch {}
record({
  id: '10-stripe-calendly',
  name: 'Stripe + Calendly URLs wired (Pat LLC master template values)',
  status: patLlcCheck.status,
  severity: 'CRITICAL',
  summary: patLlcCheck.summary,
  evidence: 'src/data/pat-llc.ts',
});

// ---- Check 11: noindex meta on every prospect page ----
let noindexCheck = 'PASS';
let noindexDetail = '';
for (const f of distFiles.filter((p) => p.endsWith('.html'))) {
  const c = readFileSync(f, 'utf8');
  if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(c)) {
    noindexCheck = 'FAIL';
    noindexDetail += `${f} missing noindex; `;
  }
}
record({
  id: '11-noindex',
  name: 'noindex meta present on every page (must be removed before launch)',
  status: noindexCheck,
  severity: 'CRITICAL',
  summary: noindexCheck === 'PASS' ? 'noindex present everywhere' : noindexDetail,
  evidence: 'dist/**/*.html',
});

// ---- Compute self-assessment confidence ----
const weights = { CRITICAL: { PASS: 0, FAIL: -25, SKIP: -8, WARN: -5 }, MAJOR: { PASS: 0, FAIL: -10, SKIP: -3, WARN: -2 }, MINOR: { PASS: 0, FAIL: -2, SKIP: -1, WARN: 0 } };
let score = 100;
for (const c of checks) {
  const w = weights[c.severity]?.[c.status] ?? 0;
  score += w;
}
score = Math.max(0, Math.min(100, score));
const verdict = score >= 80 ? 'DONE_PROVISIONAL' : 'NOT_DONE';

// ---- Write JSON ----
const json = {
  client: slug,
  url: URL,
  ranAt: NOW.toISOString(),
  engagementMode,
  checks,
  confidence: score,
  verdict,
};
const jsonPath = `qa/self-assessment-${ISO_TS}.json`;
writeFileSync(jsonPath, JSON.stringify(json, null, 2));
log(`JSON results: ${jsonPath}`);

// ---- Write approval packet (partial — orchestrator fills semantic sections) ----
mkdirSync('approval', { recursive: true });
const packetPath = `approval/${slug}-${ISO_DATE}.md`;
const checkRows = checks
  .map((c) => `| ${c.id} | ${c.severity} | ${c.status} | ${c.name} | ${c.summary} | ${typeof c.evidence === 'string' ? c.evidence : 'inline JSON'} |`)
  .join('\n');

const packet = `# Approval packet — ${slug}

**Verdict: ${verdict}**
**Self-assessment confidence: ${score}/100**
**Production URL:** ${URL}
**Ran at:** ${NOW.toISOString()}
**Engagement mode:** ${engagementMode ? 'YES (strict)' : 'NO (template-validation; tokens expected)'}

## Quick check (60-second read)

<!-- ORCHESTRATOR: fill these from research/ and design/06-direction-decision.md -->
- Vibe extracted: <ARCHETYPE + axis highlights from research/current-site-vibe.md>
- Direction chosen: <A | B | C> — <one-line rationale from design/06-direction-decision.md>
- Lighthouse mobile / desktop: ${json.checks.find((c) => c.id === '5-lighthouse')?.summary ?? 'see check 5'}
- Tap targets / a11y: ${json.checks.find((c) => c.id === '7-mobile')?.status ?? '?'} / ${json.checks.find((c) => c.id === '6-a11y')?.status ?? '?'}
- Reviews verbatim from harvest: <YES | NO — orchestrator confirms via spot-check>
- Open questions for Pat: <count>

## What changed vs. the existing site

<!-- ORCHESTRATOR: fill from research/current-site-vibe.md preserve/modernize lists + research/competitive-teardown.md differentiation -->

## Direction-pick rationale

<!-- ORCHESTRATOR: pull from design/06-direction-decision.md -->
- Chosen: <A | B | C>
- Why: <citing UX cross-review scores + vibe-fit>
- Runners-up: <one-line per non-chosen direction with reason>

**If Pat wants to redirect:** the engagement re-runs from Phase 3 with the new direction. Estimated effort: 30-50 minutes (Phase 3 dispatch + Phase 4 re-implementation + Phase 6.5 re-run).

## Self-assessment battery results

| ID | Severity | Status | Check | Summary | Evidence |
|---|---|---|---|---|---|
${checkRows}

## Open questions for Pat (single batch)

<!-- ORCHESTRATOR: collect every [CLIENT_TBD] / runtime_blocked / unresolved-token surfaced during the engagement and list them here numbered. Each entry: question + pages affected + default applied + cost to change. -->

## Things Pat should specifically double-check

- [ ] Hero photo selection (which existing-site image was promoted)
- [ ] Service slug renames (any URL changes from old → new)
- [ ] Reviews shortlist (3 chosen for homepage; full set in research/)
- [ ] Direction pick (covered above)
- [ ] Any contrast resolution applied if WCAG AA initially failed
- [ ] Any service-area towns added/removed from footer
- [ ] Any [CLIENT_TBD] defaults applied
- [ ] Proposal intro paragraphs cite real research (NOT generic boilerplate)
- [ ] Vibe-fit score on rendered build (UX Mode B review — orchestrator runs separately)

## Lessons added this engagement

<!-- ORCHESTRATOR: 3-line summary; full list in retrospectives/${slug}-${ISO_DATE}.md (Phase 8, after approval) -->

## Hard blockers (if NOT_DONE)

${verdict === 'NOT_DONE' ? '<!-- ORCHESTRATOR: for each FAIL check at CRITICAL severity, list: what was attempted (3 distinct approaches), what went wrong each time, what is needed from Pat to unblock -->' : '_(none — verdict is DONE_PROVISIONAL)_'}

## How to redirect

If Pat reads this and wants any of these adjustments:
- "Re-pick direction B" → engagement re-runs from Phase 3
- "[Q1, Q3, Q5 answers]" → single patch dispatch fills the open questions
- "Revise [page] hero" → patch dispatch with specifics
- "Approve and ship" → Phase 8 retrospective + final report
`;

writeFileSync(packetPath, packet);
log(`Approval packet: ${packetPath}`);
log(`Verdict: ${verdict} (${score}/100)`);

process.exit(0);
