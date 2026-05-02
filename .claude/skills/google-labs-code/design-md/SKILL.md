---
name: design-md
description: DESIGN.md format spec + linter for visual identity tokens. YAML frontmatter (machine-readable colors, typography, spacing, motion) + markdown prose (rationale, brand voice). Loaded by designer agent task-match for token authoring.
license: Apache-2.0
source: vendored from google-labs-code DESIGN.md format (synthesized; replace with verbatim when available)
---

# DESIGN.md format

A single canonical file at `design/07-tokens.md` (or per-client `design-system/brand-tokens.md`) that captures visual identity in two layers: machine-readable YAML frontmatter and human-readable markdown prose.

## File structure

```yaml
---
project: <client-slug>
direction: <A | B | C>
version: <semver>
created: <ISO8601>

colors:
  primary:        "#0E1E3F"
  primary_deep:   "#061330"
  accent:         "#0D7C7F"
  accent_deep:    "#0A6063"
  ink_primary:    "#161513"
  ink_secondary:  "#3A3733"
  surface:        "#FFFFFF"
  surface_warm:   "#F5F2ED"
  surface_inverse:"#0E1E3F"
  error:          "#B42318"
  success:        "#0F7A3C"

contrast_pairings:           # every pairing labeled with WCAG ratio + level
  - foreground: ink_primary
    background: surface
    ratio: 14.2
    level: AAA
  - foreground: surface
    background: primary
    ratio: 11.4
    level: AAA
  # …

typography:
  display:
    family: "Fraunces"
    weights: [500, 600]
    sizes:
      h1_mobile: "32px"
      h1_desktop: "56px"
      h2_mobile: "24px"
      h2_desktop: "36px"
  body:
    family: "Inter Tight"
    weights: [400, 500]
    sizes:
      base: "16px"
      base_desktop: "17px"
      small: "14px"
  mono:
    family: "JetBrains Mono"
    weights: [400]
    sizes:
      caption: "11px"
    letter_spacing: "0.08em"

spacing:                     # 8pt grid
  scale: [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]

radius:
  xs: "2px"
  sm: "4px"
  md: "8px"
  lg: "16px"
  pill: "999px"

motion:
  duration_fast: "200ms"
  duration_med:  "300ms"
  duration_slow: "600ms"
  easing_default: "cubic-bezier(0.22, 1, 0.36, 1)"
  easing_exit:    "ease-out"

breakpoints:
  sm: "640px"
  md: "768px"
  lg: "1024px"
  xl: "1280px"
---

# Rationale
<3-5 paragraphs: why this direction, why this palette, why this typography. Cite research from research/competitive-teardown.md and research/conversion-evidence.md.>

# Brand voice
<one paragraph: how copy sounds. Tone, register, common words to use, common words to avoid.>

# Anti-patterns explicitly rejected
- <pattern>: <rationale>
- <pattern>: <rationale>
- ... (5+ minimum)

# Component implications
<bullet list: how these tokens express in named components — ServiceCard, ReviewTile, AreaPill, etc.>
```

## Linter rules

When designer authors a DESIGN.md, run these checks before returning to orchestrator:

1. **Every contrast_pairings entry has a measured ratio.** Not "should be AA" — the ratio.
2. **Every text/background pairing used in any component spec appears in `contrast_pairings`.**
3. **AA minimum on body text.** Any pairing below 4.5:1 for body text is a FAIL.
4. **AAA preferred for hero.** Hero text/bg should hit 7:1.
5. **Typography sizes ≥16px for body** on every size variant.
6. **Touch targets ≥44px** wherever interactive.
7. **Radius scale is monotonically increasing.**
8. **Motion durations ≤900ms** unless flagged with rationale.

If any rule fails, the DESIGN.md is BLOCKED. Designer fixes and re-submits.

## Importing into Astro

Tokens render to CSS custom properties in `src/layouts/SiteLayout.astro` `:root`:

```css
:root {
  --primary: #0E1E3F;
  --accent: #0D7C7F;
  /* ... */
}
```

Per-page palette overlays use a body class hook:

```css
body.pat-page {
  --primary: #0E1E3F;   /* Pat LLC navy */
  --accent: #0D7C7F;    /* Pat LLC teal */
}
```

This lets the proposal page swap to Pat LLC palette while client pages use their direction's palette.

---

*This is a synthesized version of the google-labs-code DESIGN.md format. License Apache-2.0. Replace with the verbatim upstream when the inventory becomes available.*
