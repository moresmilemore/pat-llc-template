---
topic: web performance + Core Web Vitals
refreshed: 2026-05-04
sources:
  - https://web.dev/articles/vitals
  - https://developer.chrome.com/docs/lighthouse/overview
  - https://docs.astro.build/en/guides/performance/
---

# Web performance — current state (2026)

## Core Web Vitals — current thresholds

| Metric | Good | Needs improvement | Poor | Notes |
|---|---|---|---|---|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | 2.5–4.0s | > 4.0s | Pat LLC budget: < 2.0s mobile (tighter than CWV) |
| **INP** (Interaction to Next Paint) | ≤ 200ms | 200–500ms | > 500ms | Replaced FID in March 2024. Pat LLC budget: < 150ms |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | 0.1–0.25 | > 0.25 | Pat LLC budget: < 0.05 |

_dated 2026-05-04_

INP measures the longest interaction delay during a user's session, capturing real responsiveness. Static sites with minimal JS (Astro default) tend to have very low INP; the failure mode is heavy hydrated components.

## Lighthouse current scoring (v12.x)

Lighthouse mobile uses Moto G Power + Slow 4G throttling by default. Scores:

| Category | Pat LLC floor | Why |
|---|---|---|
| Performance | ≥ 90 mobile, ≥ 95 desktop | Below 90 mobile = Google flags as poor in Search Console |
| Accessibility | ≥ 95 | WCAG AA is binding regardless of score |
| Best Practices | ≥ 95 | Captures HTTPS, console errors, deprecated APIs |
| SEO | ≥ 95 | Captures meta, robots, schema |

Run via wired script: `URL=<url> npm run qa:lighthouse` (writes JSON + HTML report to `qa/`).

_dated 2026-05-04_

## Page weight budget (Pat LLC)

| Asset class | Budget | Notes |
|---|---|---|
| Total first-load (gz) | ≤ 500KB | Hard limit; below this Lighthouse perf >= 90 is achievable on Slow 4G |
| HTML | ≤ 50KB | Per page |
| CSS | ≤ 80KB | Combined critical + async |
| JS | ≤ 100KB | Astro static defaults to ~0KB JS; budget is for hydrated islands |
| Fonts (woff2) | ≤ 80KB | 2 families × 2 weights via fonts.bunny.net |
| LCP image | ≤ 150KB | WebP or AVIF, properly sized |

Total of all-of-the-above on the homepage: ≤ 500KB gzipped first-load.

## What's changed since training cutoffs

- **INP replaced FID** (2024-03-12) — if any agent references FID, that's stale.
- **bfcache eligibility** moved from "nice to have" to a Lighthouse audit (v11+). Avoid `unload` event listeners.
- **Speculation Rules API** is now stable in Chrome 121+ — useful for prefetching the most-likely next page (e.g., service-detail from homepage).
- **Image lazy-loading is default** for `<img loading="lazy">`. Below-fold images should explicitly opt in; LCP image must NOT be lazy-loaded.
- **Priority Hints** (`fetchpriority="high"` on the LCP image) is widely supported and recommended.
- **Compression Streams API + Brotli everywhere** — Vercel auto-applies Brotli; no operator action needed.

_dated 2026-05-04_

## Anti-patterns that hurt CWV

- Web fonts loaded without `font-display: swap` (causes invisible text → CLS+LCP penalty)
- Lottie hero animations >50KB (LCP killer)
- Carousels with auto-rotate (INP penalty + CLS)
- Hero image without `width`/`height` attributes (CLS)
- Large CSS animations on layout-impacting properties (`width`, `height`, `top`, `left`) instead of `transform`
- `display: none` toggling (forced reflow vs `content-visibility`)
- Synchronous third-party scripts (analytics in `<head>` blocks LCP)

## Tools wired in this template

- `lighthouse` (CLI) — `URL=<url> npm run qa:lighthouse`
- `@playwright/test` — smoke + mobile viewport tests
- `@axe-core/cli` + `@axe-core/playwright` — WCAG scans
- `webpagetest.org` (manual) — for cross-region + real-device verification before launch
