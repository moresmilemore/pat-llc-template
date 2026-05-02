# pat-llc-template

Template repo for Pat LLC client engagements. Spawn a per-client repo from this with:

```bash
gh repo create --template moresmilemore/pat-llc-template clients/{client-slug}
cd clients/{client-slug}
```

## What's inside

```
.claude/
├── agents/           # 7 dispatch agents: researcher, designer, ux, qa, developer, product-owner, BASE
└── skills/           # 9 load-bearing skill specs

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
```

## Per-client workflow

1. Spawn the client repo (above)
2. Open `PROJECT_BRIEF.md`, fill from intake form (kit §4)
3. Open `KICKOFF_PROMPT.md`, fill the 7 client tokens in **Section 2**
4. Paste the entire prompt into Claude Code
5. Walk away. Return at Phase 2 to pick a direction. Walk away again. Return for final QA.

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

## Dev

```bash
npm install
npm run dev          # localhost:4321
npm run build        # static build to dist/
npm run preview      # preview the build
```

## Locked tech stack — do not propose alternatives

- Astro 5+
- Tailwind v4 (optional; inline CSS in `:root` is acceptable)
- Fontsource / fonts.bunny.net for fonts
- Lucide via astro-icon
- Resend (transactional email)
- Cloudflare Turnstile (form spam protection)
- Vercel (deploy target)
