---
topic: vendor stack — current versions, recent changes, gotchas
refreshed: 2026-05-04
sources:
  - https://docs.astro.build/en/guides/upgrade-to/v5/
  - https://vercel.com/changelog
  - https://resend.com/changelog
  - https://docs.stripe.com/api/changelog
  - https://developers.cloudflare.com/turnstile/
---

# Tooling — current state (2026)

The Pat LLC stack is locked. This file captures version pins + recent changes + known gotchas so the developer + qa agents know what they're shipping against.

## Locked stack

| Vendor / lib | Pinned version | Why locked |
|---|---|---|
| Astro | `^5.0.0` | Static SSG; major version pin (5.x patches OK; do not bump to 6 without a known migration plan) |
| `astro-icon` + `@iconify-json/lucide` | `^1.1.5` + `^1.2.0` | Icon set; tree-shaken |
| Tailwind | OPTIONAL | If used, v4. Inline CSS in `:root` is acceptable and is what the current template uses |
| Fontsource / fonts.bunny.net | bunny.net (default) | Privacy-respecting; no Google fingerprinting |
| Resend | TBD per client (no SDK pinned in template; install when contact form ships) | Transactional email |
| Cloudflare Turnstile | (no SDK; loads from cloudflare.com script tag) | Spam protection without CAPTCHA UX hostility |
| Stripe (payment links only — no SDK) | n/a — links are URLs in `src/data/pat-llc.ts` | No card data ever touches the site |
| Vercel | n/a — deploy target | Static deploys, free tier, edge-cached |

## Recent vendor changes worth knowing (2024-onwards)

### Astro

- **5.0** (Nov 2024) — Content Collections v2, `astro:env` typed env vars, server islands, view transitions stable. Breaking: old content collections auto-discovery removed. Migration: add explicit `loader:` + `schema:` to each collection.
- **5.x patch series** (ongoing) — incremental improvements; `npm outdated` to track. No breaking changes within 5.x.

### Vercel

- **Deployment Protection** — opt-in (was opt-out historically). Confirm disabled per client at Settings → Deployment Protection.
- **Build Output API v3** — Astro adapter handles automatically.
- **Edge config** — out of scope for static Pat LLC sites.
- **Cron** — out of scope.

### Resend

- API has been stable since 2024. Webhook events for delivery / bounce / complaint (use for monitoring contact form deliverability).
- **Domain verification** required — DKIM + SPF + DMARC. Pat LLC handles this once per client domain.
- Free tier: 100 emails/day, 3000/month. Adequate for service-trade contact volume.

### Stripe

- Pat LLC uses **Payment Links** only (URLs configured in dashboard, embedded in proposal page). No JS SDK needed; no card data on Pat-built site.
- Avoid: Checkout SDK, Elements SDK — out of Pat LLC scope per locked stack.

### Cloudflare Turnstile

- Free.
- Site key (PUBLIC) goes in client-side `<div class="cf-turnstile">`; secret key goes in API route validating the token.
- Privacy-respecting; no behavioral profiling like reCAPTCHA v3.
- Recent change: managed challenge mode is now default. Most users see no challenge UI; bots get challenged.

_dated 2026-05-04_

## Tools wired into the template (devDeps)

| Package | Version | Purpose |
|---|---|---|
| `@playwright/test` + `playwright` | `^1.49.0` | E2E test runner; smoke + mobile + a11y projects |
| `@axe-core/cli` + `@axe-core/playwright` | `^4.10.0` | WCAG scans; CLI + in-browser |
| `lighthouse` | `^12.2.0` | Perf + a11y + SEO + best-practices scoring |

Run `npm outdated` periodically. Bumps within these majors are auto-applied via `^` ranges.

## Pat LLC environment variables (per client)

Listed in `.env.example`. Required per client:

- `RESEND_API_KEY` — secret
- `RESEND_FROM_EMAIL` — must be on a verified domain
- `RESEND_TO_EMAIL` — client's inbox
- `PUBLIC_TURNSTILE_SITE_KEY` — public, exposed to browser
- `TURNSTILE_SECRET_KEY` — secret

Configure via Vercel dashboard → Settings → Environment Variables. Use `astro:env/server` in code to read (typed access).

## Build outputs to verify

After `npm run build`:

- `dist/` contains static HTML/CSS/JS
- One `*.html` per route (homepage, audit, proposal, each service)
- `_astro/` directory of hashed asset bundles
- No source maps in production build (Astro default)

After `npx vercel`:

- Preview URL printed
- Disable Deployment Protection in dashboard manually (cannot toggle from CLI)

## Known gotchas

1. **`process.env` vs `astro:env` vs `import.meta.env`** — Astro 5 prefers `astro:env/server` for typed access. `process.env` works in `.mjs` config files (like `astro.config.mjs`) but not inside Astro components.
2. **fonts.bunny.net latency** — first request is sometimes slow from new edge locations. The template uses `<link rel="preconnect">` to mitigate.
3. **Vercel preview vs prod env vars** — different scopes; verify both are set when shipping.
4. **Playwright on Asahi Fedora ARM64** — "BEWARE: your OS is not officially supported" warning during install is benign; Ubuntu 24.04 ARM64 fallback build runs.
5. **Stripe Payment Link price + name** — once embedded in the proposal page, the URL is canonical. Changing price in Stripe dashboard creates a new URL; update `src/data/pat-llc.ts`.
