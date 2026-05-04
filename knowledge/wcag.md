---
topic: WCAG accessibility — current criteria and tooling
refreshed: 2026-05-04
sources:
  - https://www.w3.org/TR/WCAG22/
  - https://www.w3.org/TR/wcag-3.0/  (draft — not yet standard)
  - https://webaim.org/standards/wcag/checklist
---

# WCAG — current state (2026)

## Standard in force: WCAG 2.2 AA

WCAG 2.2 was finalized 2023-10-05. It's the current binding standard. Pat LLC builds target **2.2 AA** (not 2.0, not 3.0).

### What's new in 2.2 vs 2.1

Nine new success criteria, the load-bearing ones for service-trade sites:

| SC | Level | What |
|---|---|---|
| 2.4.11 Focus Not Obscured (Minimum) | AA | Focused element must be at least partially visible — sticky nav must not cover focus target |
| 2.4.13 Focus Appearance | AAA | Visible focus ring with min thickness + contrast (we hit AA via :focus-visible default) |
| 2.5.7 Dragging Movements | AA | Any drag interaction needs a non-drag alternative (no hidden drag-required slider) |
| 2.5.8 Target Size (Minimum) | AA | Tap targets ≥ 24×24 CSS pixels (we exceed this — 44×44 per Pat LLC) |
| 3.2.6 Consistent Help | A | Help mechanism (contact, FAQ link) appears in same relative order on every page |
| 3.3.7 Redundant Entry | A | Don't require re-entering info already provided in the same flow |
| 3.3.8 Accessible Authentication (Minimum) | AA | No cognitive function tests for auth (CAPTCHAs that require puzzle-solving fail) |

_dated 2026-05-04_

## WCAG 3.0 status (as of refresh date)

WCAG 3.0 is still a Working Draft — NOT yet a recommendation. The Bronze/Silver/Gold rating model is not in force. Do NOT design to 3.0; agents that reference it should be corrected.

## AA criteria the build MUST hit

| Area | Requirement | How we verify |
|---|---|---|
| Color contrast | Body text 4.5:1, large text 3:1, UI components 3:1 | axe-core + manual review per direction |
| Touch targets | ≥ 24×24 (Pat LLC: 44×44) | Playwright `mobile.spec.ts` |
| Focus visible | Every interactive element has visible focus indicator | manual + axe |
| Focus not obscured | Sticky nav z-index works with `scroll-margin` | manual review on long pages |
| Keyboard reachable | Tab through reveals every interactive element | manual review |
| ARIA landmarks | nav, main, footer, complementary present + labeled | axe |
| Form labels | every input has `<label>` (not placeholder-only) | axe |
| Heading order | no h1→h3 skip | axe |
| Reduced motion | `prefers-reduced-motion: reduce` disables decorative motion | manual via DevTools |
| Alt text | every `<img>` has alt; decorative gets `alt=""` | axe + manual content review |

## Legal context (US, 2026)

- **ADA Title III** — applies to service businesses with public-facing websites. Lawsuits trending up. Settlement amounts $5K–$50K typical.
- **DOJ Final Rule** (2024-04-08) — state and local government websites must conform to WCAG 2.1 AA by April 2026 (large entities) / April 2027 (small). Influences court interpretation of "accessible" for private-sector ADA cases.
- **EU EAA** (European Accessibility Act) — June 2025 enforcement deadline. Affects service businesses serving EU customers; Pat LLC is US-only by default but flag if a client serves EU.

_dated 2026-05-04_

## Verification tooling (wired in template)

- **axe-core CLI**: `URL=<url> npm run qa:a11y` → `qa/axe-report.json`
- **@axe-core/playwright**: in-browser scan via `qa/tests/homepage.a11y.spec.ts`
- **Lighthouse a11y category** (≥95 floor): `URL=<url> npm run qa:lighthouse`

axe catches ~57% of WCAG issues automatically. Manual review is required for: meaningful sequence, info conveyed by color, semantic correctness, alt text appropriateness (axe checks presence, not quality).

## Common Pat LLC violations and fixes

| Violation | Common cause | Fix |
|---|---|---|
| Color contrast fail | Hex pair from designer's mood-board not measured | Use the contrast_pairings linter in `design/07-tokens.md` |
| Touch target < 44px on mobile | Padding stripped on mobile breakpoint | Verify `padding` and explicit `min-height: 44px` on every interactive |
| Missing skip link | Not in template | (Add if accessibility audit is required by client) |
| Form placeholder used as label | Quick designer shortcut | Always use `<label>` element, even if visually hidden via `.sr-only` |
| Image with `alt=""` for content image | Decorative-image fallback misapplied | Decision tree: if removing the image loses information, alt MUST describe it |
| Reduced-motion not honored | `prefers-reduced-motion` query missing | Always include the global rule from `motion-design` skill |

## What's coming (2026-2027)

- **WCAG 2.2 AAA** will likely be referenced in DOJ enforcement guidance for "exemplary" compliance — not a binding shift, but worth designing toward when feasible (typography contrast targets in design tokens).
- **Mobile-specific WCAG criteria** (orientation, motion, hover/focus) — already in 2.1 AA; expect tighter enforcement.
- **AI-generated content disclosure** — emerging best practice (not yet WCAG): if reviews / photos / copy is AI-generated, label it. Pat LLC engagement rule already requires zero AI-generated content passed as real, so this is a no-op.
