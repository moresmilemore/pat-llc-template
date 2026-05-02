---
name: design-system
description: Per-project visual identity workflow — brand tokens, component patterns, design principles. Reference files (brand-tokens.md, component-patterns.md, design-principles.md) authored per client. Loaded by designer, ux, developer, qa agents.
---

# Design system

## Workflow

### 1. Context-aware generation
Before producing any design artifact, read in order:
- `PROJECT_BRIEF.md` — the client facts + visitor types + anti-goals
- `research/competitive-teardown.md` — what to avoid, what to reference
- `research/conversion-evidence.md` — info density, contact mechanism, trust signals
- `research/current-site-strengths.md` — what to PRESERVE verbatim from the existing site
- `research/reputation-harvest.md` — verbatim review text for placement decisions

### 2. Reference-based design
For every visual decision, name a reference. Either:
- A specific competitor / exemplar from the teardown ("hero composition references {site}'s pattern")
- A documented principle from the conversion-evidence ("first-scroll info density per [Baymard 2024]")
- An anti-pattern being explicitly rejected ("REJECTS the AI editorial template per anti-pattern lock-list")

Designs without references are guesses.

### 3. Generate + refine (two iterations minimum)
Never ship a first-draft direction as final. Phase 2 produces three directions; each gets a self-critique pass before submission to UX cross-review. The self-critique looks for:
- Anti-pattern leak (did I claim to reject a pattern but leave traces?)
- Differentiation collapse (do A/B/C feel meaningfully different, or is one a tweak of another?)
- Contrast failures (did I check every text/bg pairing against WCAG AA?)
- First-scroll info-density mismatch (does mobile actually show what the brief requires above fold?)

### 4. Component-first
After direction is locked (Phase 3), break the page into named components. Spec each component once; reference the spec from every page that uses it. No ad-hoc component variants in page templates.

## Per-client reference files

When a client engagement requires more than the locked Pat LLC palette + chosen direction tokens, author these in the client repo (NOT in the template):

- `design-system/brand-tokens.md` — colors, typography, spacing, motion, radii (frozen DESIGN.md format)
- `design-system/component-patterns.md` — ServiceCard, ReviewTile, AreaPill, FAQItem, etc., with states + variants
- `design-system/design-principles.md` — 5-7 short principles ("we are direct, not clever"; "we lead with reviews, not stock photos")

These are reference-only — implementation lives under `src/components/` per file naming conventions.

## Rules of use across agents

- **Designer** uses this skill to author tokens + decompose tasks. Designer is the only agent that PRODUCES the artifacts above.
- **UX** uses this skill to verify rendered output matches the spec.
- **Developer** uses this skill to verify implementation matches token definitions (no hex literals in components when tokens exist).
- **QA** uses this skill to spot-check brand consistency across pages in Mode 2 content review.

## What this skill does NOT define

- Per-client palettes — those come from the chosen Phase 2 direction
- Astro component implementation — that's developer + orchestrator
- Copy and voice — that's research-derived + orchestrator-drafted + Pat-edited
