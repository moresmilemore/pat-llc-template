---
topic: Astro 5+ — current patterns and breaking changes
refreshed: 2026-05-04
sources:
  - https://docs.astro.build/en/guides/upgrade-to/v5/
  - https://docs.astro.build/en/getting-started/
  - https://astro.build/blog/
---

# Astro — current state (2026)

## Current major version

**Astro 5.x** is the current major. Released late 2024. Pat LLC template is pinned to `^5.0.0`.

Locked stack reminder: do NOT propose Next.js, Remix, SvelteKit, or any framework alternative. Astro is binding for Pat LLC builds.

## Breaking changes 4 → 5 (binding)

| Change | What to do |
|---|---|
| **Content Collections v2** | Use `defineCollection({ loader, schema })`; old `src/content/{collection}/` auto-discovery removed. |
| **astro:env** typed env vars | Use `import { ENV_NAME } from 'astro:env/server'` instead of `import.meta.env.X` for type-safe + validated env access in API routes. |
| **server islands (`server:defer`)** | New for personalization on static sites. Pat LLC default: do NOT use; static is sufficient. |
| **View Transitions** | Now stable; the `astro:transitions` directive replaces the old `<ViewTransitions />` component. Default in template: OFF. |
| **Vite 6** | Build config is Vite 6; some plugins from Vite 5 era need bumps. |

_dated 2026-05-04_

## Pat LLC patterns (binding)

### Static-only by default

Every page in `src/pages/` is `output: 'static'` (the Astro default). No SSR unless explicitly required. Reasons: Vercel deploys faster, costs nothing, Lighthouse scores higher, edge-cached globally.

If a page genuinely needs SSR (form post handling, dynamic personalization), use API routes in `src/pages/api/` rather than flipping the whole page to SSR.

### Component patterns

- **Server-rendered Astro components** for everything by default — these ship 0KB JS.
- **Client-hydrated framework components** (React/Svelte/Vue) ONLY when interactivity demands it. Even then, prefer `client:visible` over `client:load`.
- **Vanilla JS in `<script>` tags** for tiny interactions (banner dismiss, copy button) — the layout already does this.

### Image handling

- Use `<Image />` from `astro:assets` for any image larger than ~10KB.
- Sources go in `src/assets/` (not `public/`) so they get optimized.
- Format priority: AVIF → WebP → original. Astro handles the picture-set automatically.
- LCP image: explicit `width` + `height`, `loading="eager"`, `fetchpriority="high"`.

### Routing

- File-based routing under `src/pages/`.
- Dynamic routes via `[slug].astro` + `getStaticPaths()` returning the full set at build time.
- Trailing slash convention: Astro 5 default is `'ignore'` — both `/audit` and `/audit/` work. Vercel handles 301 to canonical.

## Current performance defaults

- **CSS**: Astro inlines critical CSS by default; rest is hashed and async.
- **JS**: zero by default. Hydrated islands ship only their own bundle.
- **Fonts**: NOT auto-optimized. Pat LLC pattern: fonts.bunny.net (no Google fingerprinting) with `font-display: swap`.
- **Prefetch**: `astro:prefetch` directive enables hover-based + viewport-based prefetch. Pat LLC pattern: enabled on tab nav links only.

## Anti-patterns specific to Astro

| Anti-pattern | Why it fails |
|---|---|
| `client:load` everywhere | Defeats Astro's purpose; ships React + the component tree on first paint |
| Importing React just for a button | Use a vanilla `<button>` + script |
| Putting images in `public/` | They skip Astro's optimization pipeline |
| `process.env.X` in components | Build-time only and untyped; use `astro:env` |
| Rendering large lists with `.map` of full components | Use a single Astro component that renders the list internally |
| `client:only` for animations | Use CSS animations or a tiny inline script instead |

## Vendor versions Pat LLC pins

| Package | Version | Why |
|---|---|---|
| `astro` | `^5.0.0` | Major-version pin; minor + patch auto-bump |
| `astro-icon` | `^1.1.5` | Lucide via `@iconify-json/lucide` |
| `@iconify-json/lucide` | `^1.2.0` | 1500+ icons, tree-shaken |
| `@playwright/test` | `^1.49.0` | Test runner |
| `lighthouse` | `^12.2.0` | CLI |
| `@axe-core/cli` | `^4.10.0` | a11y CLI |

Run `npm outdated` periodically; bump within the major.

## Deploy target: Vercel

- `npx vercel` for preview, `npx vercel --prod` for production.
- Static deploys are free.
- If `vercel --prod` fails, use the alias-set workaround:
  ```
  npx vercel alias set <preview-url> <production-host>
  ```
- Disable Deployment Protection in dashboard manually (cannot be set from CLI).
- Rollback: `vercel rollback`.

_dated 2026-05-04_
