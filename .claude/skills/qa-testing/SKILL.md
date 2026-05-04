---
name: qa-testing
description: QA agent's test selection and execution protocol. Mode selection framework. Runtime evidence required (SIMULATED = FAIL). Loaded by qa agent on every dispatch.
---

# QA testing protocol

## Mode selection framework

The HANDOFF_PACKET names which modes to run. If unclear, default mappings:

| Trigger | Modes to run |
|---|---|
| New page deployed | 1 (smoke) + 2 (content) |
| Pre-handoff to Pat | 1 + 2 + 3 (Lighthouse) + 5 (walkthrough) |
| Pre-launch (prospect → client) | 1 + 2 + 3 + 4 (a11y) + 5 |
| After fix re-deploy | Affected mode only |
| Lighthouse score regression suspected | 3 only |
| WCAG complaint or audit | 4 only |

## Mode 1 — Smoke (baseline aliveness)

Pass criteria:
- Every route returns 200 (homepage `/`, `/audit`, `/proposal`, every `/services/{slug}`)
- `npm run build` exits 0
- No `console.error` or unhandled rejections on initial page load
- Demo banner renders on every prospect-facing page
- Sticky tab nav renders on every prospect-facing page
- Footer renders with NAP

Time budget: 10-15 minutes.

## Mode 2 — Content (per-client correctness)

Pass criteria:
- Client name correct in hero, footer, meta `<title>`, proposal intro paragraphs
- Phone number is client's, formatted consistently, `tel:` link working
- Email is client's, `mailto:` link working
- Service area cities/towns match `PROJECT_BRIEF.md`
- Service slugs match research output (no typos in URL slugs)
- Reviews are verbatim from `research/reputation-harvest.md` (no paraphrasing, no fabrication)
- License/insurance values appear where required
- Zero `{{TOKEN}}` strings remaining anywhere
- No "lorem ipsum" or AI-generated boilerplate phrases ("In today's fast-paced world", "leverage cutting-edge")
- Proposal page uses Pat LLC palette (navy + teal); other pages use chosen direction's palette

Time budget: 20-30 minutes.

## Mode 3 — Lighthouse

Pass criteria (mobile floor):
- Performance ≥90
- Accessibility ≥95
- Best practices ≥95
- SEO ≥95
- LCP <2.0s
- CLS <0.05
- INP <150ms (or TBT <200ms as proxy in Lighthouse)
- First-load total weight <500KB

Capture full JSON output. If any score is below floor, file MAJOR finding naming the metric + most likely cause + recommended fix.

Time budget: 5-10 minutes per page × N pages.

## Mode 4 — Accessibility (axe-core)

Run axe via CLI or programmatic API. Capture violations. Verify:
- All color contrast pairings AA
- Image alt text present
- Form label associations
- Heading order (no h1→h3 skip)
- Keyboard reachability — tab through every interactive element, document tab order
- Focus visibility on every interactive element
- ARIA landmarks present and labeled
- Touch targets ≥44×44px on mobile

Any AA violation = CRITICAL.

Time budget: 15-20 minutes per page.

## Mode 5 — Production walkthrough

End-to-end as a prospect. On both mobile (375×667) and desktop (1280×800):

- Click every link in the tab nav
- Click every service tile on the homepage
- Click "Schedule a call" button — Calendly loads?
- Click each Stripe deposit link — Stripe checkout loads with the right amount?
- Tap-to-call link — opens dialer? (mobile only, real device or DevTools mobile mode)
- Tap-to-text link — opens SMS composer? (mobile only)
- Back button works from each click
- Refresh on each page works (no SSR/static mismatch)
- View source — `<meta name="robots" content="noindex" />` present (must be in template until launch)

Time budget: 30-45 minutes.

## Runtime tooling (pre-installed via `npm install`)

The template ships with these tools wired up via `package.json`. After `npm install`, all are available — Playwright browsers auto-install via the `postinstall` script. If browser install was skipped, run `npx playwright install chromium` manually.

| Tool | Purpose | Command |
|---|---|---|
| Playwright | Headless browser, smoke + mobile + a11y test runner | `npx playwright test --project=smoke` (or `mobile`, `a11y`) |
| Playwright (CLI) | Ad-hoc screenshot capture | `npx playwright screenshot --browser=chromium --viewport-size=375,667 --full-page <url> qa/screenshots/<name>.png` |
| Lighthouse | Performance + a11y + SEO scoring | `URL=<url> npm run qa:lighthouse` (writes to `qa/lighthouse-report.json` + `.html`) |
| @axe-core/cli | Standalone WCAG scan | `URL=<url> npm run qa:a11y` (writes to `qa/axe-report.json`) |
| @axe-core/playwright | In-test WCAG scanning | `import AxeBuilder from '@axe-core/playwright'` (see `qa/tests/homepage.a11y.spec.ts`) |

Pre-built test specs live in `qa/tests/`:
- `*.smoke.spec.ts` — route 200s, banner, nav, footer
- `*.mobile.spec.ts` — iPhone 13 viewport, tap targets, tel: link
- `*.a11y.spec.ts` — WCAG 2.1 AA scan via axe-core

To run against a deployed preview URL instead of localhost:
```
PLAYWRIGHT_BASE_URL=https://preview.vercel.app npx playwright test
```

## Runtime evidence (mandatory)

Every finding includes one or more:
- Screenshot saved to `qa/screenshots/{mode}/{finding-id}.png`
- Lighthouse JSON saved to `qa/lighthouse-{timestamp}.json` (or HTML report at `lighthouse-report.html`)
- axe report saved to `qa/axe-{timestamp}.json`
- Playwright trace / video at `qa/playwright-output/` on failures
- Console output captured to `qa/console-{timestamp}.log`
- HTTP response codes for every route in `qa/routes-{timestamp}.txt`

If runtime tooling is unavailable: report `runtime_blocked: <which tool>` in artifact header and STOP. Do not file findings without evidence.

## Output

Per BASE-AGENT.md §6 review format. Include `runtime_evidence` field listing all artifacts captured.
