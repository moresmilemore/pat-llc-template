# pat-llc-template

Template repo for Pat LLC client engagements. Spawn a per-client repo from this with:

```bash
gh repo create --template moresmilemore/pat-llc-template clients/{client-slug}
cd clients/{client-slug}
```

## What's inside

```
.claude/
├── agents/
│   ├── BASE-AGENT.md                   # standing orders inherited by every dispatch
│   ├── {researcher|designer|ux|qa|developer|product-owner}.md       # role specs
│   ├── {researcher|designer|ux|qa|developer|product-owner}.lessons.md  # accumulated lessons (orchestrator-owned)
│   └── _orchestrator.lessons.md        # the head agent's own lessons file
└── skills/           # 12 load-bearing skill specs (incl. vibe-extraction, motion-design, modernization-mapping)

src/
├── components/PatMark.astro      # Pat LLC brand mark (4 sizes + inverted)
├── layouts/SiteLayout.astro      # sticky tab nav, demo banner, palette overlay hooks, NAP footer
├── data/
│   ├── pat-llc.ts    # Pat LLC constants (Stripe + Calendly + brand) — substitute once at one-time setup
│   ├── client.ts     # Per-client tokens — edit during Phase 4
│   └── services.ts   # Per-client service list — edit during Phase 4
└── pages/
    ├── index.astro                 # homepage stub (Phase 4 builds the real one)
    ├── audit.astro                 # site audit skeleton (severity cards + 10-row comparison)
    ├── proposal.astro              # proposal page (9 deliverables + 3 tiers + 7 FAQ)
    └── services/[slug].astro       # per-service dynamic page

PROJECT_BRIEF.md      # fill-in-the-blanks intake template
KICKOFF_PROMPT.md     # paste this into Claude Code at engagement start

retrospectives/       # produced at Phase 7 of every engagement; per-client lessons + template-propagation block
```

## How agents learn over time

Each agent has its own lesson file at `.claude/agents/{agent}.lessons.md`. The orchestrator (Claude Code running `KICKOFF_PROMPT.md`) is the only entity that writes these files, and only at the Phase 7 retrospective after the engagement ships. Each agent reads ONLY its own lessons file at the start of every dispatch — agents do not see each other's lessons. This keeps memory siloed and prevents groupthink while still letting the head agent regroup the team via cross-cutting `BASE-AGENT.md` updates when patterns emerge.

Lessons are tagged CRITICAL / MAJOR / MINOR. Pruning order is MINOR → MAJOR → CRITICAL (CRITICAL never pruned by importance, only superseded). Lessons graduate from per-client repo to the template repo by Pat's manual curation — the retrospective produces a copy-paste-ready propagation block at the top of each retro for that purpose.

## Per-client workflow (the repeatable path)

```bash
gh repo create --template moresmilemore/pat-llc-template clients/{client-slug}
cd clients/{client-slug}
bash scripts/bootstrap.sh         # Node + Playwright + browsers
npm run new-engagement            # interactive: prompts for the 7 tokens
                                  # → fills client.ts + PROJECT_BRIEF.md + KICKOFF.engagement.md
URL=https://existing-client.com npm run scrape    # optional but recommended
```

Then open `KICKOFF.engagement.md` and paste into Claude Code. The orchestrator runs phases 0 → 7 autonomously and produces `approval/{client-slug}-{date}.md` for your single review pass.

For approve-and-ship: `URL=https://prod-url.vercel.app npm run launch:check --apply` flips the `noindex` meta and confirms production-readiness.

Kit reference: see the kickstart kit doc for hour-by-hour playbook, failure modes, pricing tiers, pre-launch checklist.

## One-time Pat LLC setup

Before client #1, replace placeholders in `src/data/pat-llc.ts`:

- `stripeTierA`, `stripeTierB`, `stripeTierC` — your real Stripe payment links
- `calendlyIntro` — your real Calendly intro-call URL
- `email`, `phone` — your contact

Then push this template to GitHub and mark it as a template:

```bash
gh repo create moresmilemore/pat-llc-template --source=. --public --push
gh repo edit moresmilemore/pat-llc-template --template
```

## First-time setup

If this is a fresh machine without Node.js, run the bootstrap script. It handles everything — installs Node 20+ via your OS package manager (dnf / apt / pacman / brew / winget), runs `npm install`, fetches the Playwright Chromium browser, and verifies the install. Idempotent.

```bash
bash scripts/bootstrap.sh
```

For Linux servers / containers that need Playwright system libs (libnss, libgbm, fonts):

```bash
bash scripts/bootstrap.sh --with-deps
```

The bootstrap runs `sudo` only for the system package manager step — it prompts once for your password. Review the script before running if you're cautious; it's ~80 lines of bash.

## Dev (Node already installed)

```bash
npm install          # installs deps + auto-fetches Chromium via postinstall
npm run dev          # localhost:4321
npm run build        # static build to dist/
npm run preview      # preview the build
```

If the postinstall Chromium fetch fails (offline, disk space, network policy), recover with:

```bash
npx playwright install chromium       # browser only
npm run setup:deps                    # system libs (Linux, sudo)
```

## Self-assessment battery (Phase 6.5 entrypoint)

The orchestrator runs this before declaring "I think I'm done." Manual invocation:

```bash
URL=https://preview.vercel.app npm run self-assessment      # against deployed
npm run self-assessment                                     # local: builds, serves dist/, tests
```

Outputs:
- `qa/self-assessment-{ISO}.json` — machine-readable check results
- `approval/{client-slug}-{date}.md` — partial approval packet (orchestrator fills semantic sections via UX dispatches)

Eleven checks: build / routes / unresolved tokens / fabrication (orchestrator) / Lighthouse mobile floor (P≥90 A≥95 BP≥95 SEO≥95) / WCAG axe / mobile interactions / vibe-fit (orchestrator) / proposal-intro citation (orchestrator) / Stripe+Calendly wiring / noindex meta. Score ≥80 = `DONE_PROVISIONAL`; below = `NOT_DONE`.

The script auto-manages a local `astro preview` server when URL is localhost (so Lighthouse hits the production build, not the dev server). Lighthouse is auto-pointed at the Playwright-installed Chromium binary so it works without a system Chrome install.

## Knowledge base

```bash
npm run knowledge:check       # report which knowledge/*.md files are stale (>30 days)
```

The `knowledge/` directory holds current-as-of-recent-refresh references the agents read before specialized work. Refresh is dispatched via the HANDOFF_PACKET at `.claude/agents/HANDOFF-PACKETS/knowledge-refresh.md`.

## QA tooling (pre-wired)

```bash
# smoke / mobile / a11y test runs (uses dev server automatically)
npx playwright test --project=smoke
npx playwright test --project=mobile
npx playwright test --project=a11y

# against a deployed preview URL
PLAYWRIGHT_BASE_URL=https://preview.vercel.app npx playwright test

# Lighthouse + axe one-shots
URL=https://preview.vercel.app npm run qa:lighthouse
URL=https://preview.vercel.app npm run qa:a11y
```

Test specs are at `qa/tests/*.spec.ts`. Reports land in `qa/` (gitignored except spec files).

## Locked tech stack — do not propose alternatives

- Astro 5+
- Tailwind v4 (optional; inline CSS in `:root` is acceptable)
- Fontsource / fonts.bunny.net for fonts
- Lucide via astro-icon
- Resend (transactional email)
- Cloudflare Turnstile (form spam protection)
- Vercel (deploy target)
