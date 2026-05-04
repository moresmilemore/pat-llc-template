---
name: modernization-mapping
description: Translate detected vibe (research/current-site-vibe.md) into modern execution patterns — typography, color, composition, motion — that preserve the archetype while updating dated execution defaults. Loaded by designer in Phase 2 (direction proposals). Goal — modern + tasteful + on-vibe, not generic-modern.
---

# Modernization mapping

The vibe-extraction skill catalogs what the business currently IS. This skill translates that into how the modernized site should EXECUTE — typography, color logic, composition, density, motion character, photography handling — for each archetype.

**Operating rule: modernize the execution, preserve the archetype.** A `warm-trad` business should still read as warm-traditional after the rebuild — just no longer dated. The failure modes are (a) keeping dated defaults out of nostalgia, and (b) over-modernizing into a different archetype (warm-trad → boutique, or polished-pro → engineered).

## Per-archetype modernization profile

For each archetype, this skill defines: a typography pairing pool, a color logic, a hero composition pattern, density target, motion character, photography handling, and the most common over-modernization failure to avoid.

### `warm-trad` — Warm Traditional Trade

**Preserve:** owner photo, fleet photo, "established" date, warm color, serif accent, hand-feel logo, generational language.

**Replace:**
- Dated stretched serif headlines → Fraunces (variable, weighted 500-600), modest sizing
- Brown/burgundy photography overlays → no overlay, real photo
- Center-stacked hero with one big photo → asymmetric hero with photo + content side-by-side
- "Family owned since 1947" tagline blob → caption-style mono-set date marker, headline does the work
- Dense paragraph-only services list → service grid, 6-9 items, each with one-line plain-English description

**Modern execution profile:**
- Typography: Fraunces (display) + Inter Tight (body) OR Source Serif 4 (display) + Source Sans 3 (body)
- Color logic: warm neutral surface (cream `#F5F1EA` or paper `#F8F5F0`), forest/navy primary, muted gold or rust accent. Avoid pure white surfaces.
- Hero composition: 60/40 photo/content split desktop, photo on top mobile. Owner or fleet photo, NOT stock.
- Density target: balanced (3-4 ideas above fold)
- Motion character: slow, settles. 300-500ms state, 700-900ms reveal. Easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Photography: real-only. Include a date stamp or year-tag on the heritage shot.

**Most common over-modernization failure:** sliding into `boutique` by darkening the palette, removing the owner photo, and using designer-y typography. The result is "expensive remodel" instead of "trustworthy local trade." Keep the warmth.

### `polished-pro` — Polished Modern Trade

**Preserve:** clean professional palette, fleet/uniform imagery, certifications visible, mid-density.

**Replace:**
- Generic stock photo of smiling person in uniform → real fleet/team photo
- Three-feature card row mirroring competitors → distinctive composition (e.g., metric-led hero, or before/after slider, or service-by-area matrix)
- "We're the leading…" tagline → one concrete differentiation claim from research
- Inter + everywhere → considered pairing
- Generic blue-to-blue gradient → solid navy + chosen accent

**Modern execution profile:**
- Typography: Inter Tight (display + body, weight differentiation) OR Geist (display + body) OR Söhne (display + body)
- Color logic: navy or deep teal primary, single sharp accent (often green, orange, or warm yellow), white or light gray surfaces. Pure white surface is acceptable here.
- Hero composition: split asymmetric, content-left photo-right desktop. Concrete claim above fold (e.g., "1,200+ jobs in [Town] since 2009").
- Density target: balanced to dense (3-5 ideas)
- Motion character: brisk, professional. 180-250ms state, 500-700ms reveal. Easing `cubic-bezier(0.4, 0, 0.2, 1)`.
- Photography: real-only, structured (consistent crops, color-graded for warmth or coolness based on accent).

**Most common over-modernization failure:** the AI editorial template (cream + serif italic) sneaking in because it codes as "tasteful" — but it strips the professional-trade signal. Keep navy, keep certifications visible, keep the trade legible.

### `neighborhood` — Approachable Neighborhood

**Preserve:** owner-named copy ("Mike will pick up"), warm color, casual register, low signal-strength.

**Replace:**
- Cartoon mascot or hand-drawn illustration → real owner photo at human-scale (not corporate headshot)
- Curly script font → rounded humanist sans (Bricolage, Söhne Breit, or Inter Display rounded variant)
- Pastel everything → one warm dominant color, supported by neutral
- Long autobiographical block → short owner intro + tap-to-text
- "Welcome to our website!" → start with a concrete service offer

**Modern execution profile:**
- Typography: Bricolage Grotesque (display) + Geist (body) OR Inter Display (display) + Inter Tight (body, lighter weights)
- Color logic: warm dominant (coral, rust, mustard, sage, terracotta) at moderate saturation, paired with a soft neutral (warm cream or light sand). White surfaces feel cold here — avoid pure `#FFFFFF`.
- Hero composition: photo-led but human-scale. Owner / shop / dog / van. Low-formality copy.
- Density target: spacious (1-2 above fold + clear next action)
- Motion character: gentle, friendly. 250-350ms state, 600-800ms reveal. Easing with tiny overshoot (`cubic-bezier(0.34, 1.2, 0.64, 1)`, ≤8% overshoot — never bouncy).
- Photography: real, casual, warm-graded. Family / team / dog / shop are all fair game.

**Most common over-modernization failure:** sliding into `polished-pro` by adding navy, badges, and certifications above the fold. That kills the neighborhood charm. Keep it human, keep the owner name visible, keep the casual register.

### `engineered` — Engineered Precision (often B2B)

**Preserve:** technical accuracy, certifications, terse copy, monochrome bias, schematic feel.

**Replace:**
- Stock industrial photo → schematic illustration, real equipment photo, or no photo (typography-led hero)
- Aqua/orange "tech" gradient → near-monochrome with single sharp accent
- Generic "innovative solutions" copy → exact terms-of-art (the audience knows the jargon and wants it)
- Decorative motion → near-zero motion
- Three-feature card row → spec-sheet treatment (ServiceCard with metric, capability, certification)

**Modern execution profile:**
- Typography: Geist (display + body, heavy weight differentiation) + JetBrains Mono (caption + spec) OR IBM Plex Sans + IBM Plex Mono OR Söhne + Söhne Mono
- Color logic: near-monochrome (steel `#3A3A3A`, ink black, off-white surface) + one sharp accent (often safety yellow, electric blue, or laser red — but only one)
- Hero composition: type-led, no hero photo required. Headline is a precise capability claim. Optional schematic illustration.
- Density target: dense-utilitarian (5+ ideas above fold; B2B audiences read)
- Motion character: minimal, mechanical. 120-180ms state, NO scroll reveals. Easing `linear` or `ease-out`.
- Photography: schematic > real equipment > no photo. Stock industrial photography is rejected.

**Most common over-modernization failure:** introducing decorative motion or warm color in pursuit of "approachability." This audience reads warmth as imprecision. Stay monochrome, stay terse, let the spec be the design.

### `boutique` — Boutique Premium

**Preserve:** considered photography, deep neutral palette, low service-count, premium price-point signaling.

**Replace:**
- Heavy serif-italic everywhere → considered serif at editorial sizes only (display); body in clean sans
- Black-on-black mystery copy → high-contrast typography, just on a deeper neutral surface
- "Bespoke" / "curated" buzzwords → specific work descriptions
- Large hero photo only → photo + measured copy + price-context (if appropriate)
- Static site without motion → considered fade-led motion

**Modern execution profile:**
- Typography: Recoleta (display) + Söhne (body) OR Editorial New + Söhne OR Tiempos Headline + Söhne
- Color logic: deep neutral surface (`#1A1A1C`, `#FAF8F5`, or `#0F1316`), single muted accent (deep forest, oxblood, brass), high typography contrast. Avoid pure white.
- Hero composition: full-bleed photo OR generous-margin typography hero. Either commits — don't hedge.
- Density target: spacious (1-2 above fold; the commitment is "what we do is special enough to deserve breathing room")
- Motion character: slow, expensive-feeling. 350-500ms state, 800-1100ms reveal. Easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Photography: high-craft, color-graded, considered. Photographer credit acceptable.

**Most common over-modernization failure:** the AI editorial template — boutique is the closest archetype to that anti-pattern, so it's the highest-risk slot. The difference: AI editorial has cream + serif italic + § markers + grain. Boutique done well has restraint + commitment + considered photography, NOT a magazine pastiche.

### `civic` — Civic / Institutional

**Preserve:** trust-via-credentials, formal register, accessible blues, longer-form text capacity.

**Replace:**
- 1990s-era seal cluster → consolidated credentials block with proper hierarchy
- All-caps banner-style headlines → sentence-case headlines, formal-but-readable
- Tahoma/Verdana → Source Serif 4 + Source Sans 3 OR Public Sans + Source Serif 4
- Fixed-width center column → modern responsive grid maintaining longer-form reading
- No motion at all → minimal functional motion (focus rings, state transitions)

**Modern execution profile:**
- Typography: Source Serif 4 (display) + Source Sans 3 (body) OR Public Sans (both)
- Color logic: accessible blue primary (test against AAA), warm white surface, minimal accent (often gold, deep red, or muted green). Reject "tech blue" gradients.
- Hero composition: type-led with credentials block prominent. Photo if used is formal (building, owner in formal context).
- Density target: balanced to dense (text-readable, not visually dense)
- Motion character: functional only. 150-200ms state, NO decorative motion.
- Photography: formal, real-only.

**Most common over-modernization failure:** chasing "modern startup" cues (gradients, big sans, motion) and breaking the trust-via-formality contract. The audience expects formal — deliver formal, just well-set.

## Blend handling

When the vibe extraction returns a blend (e.g. `warm-trad × neighborhood`):

1. The dominant archetype's profile is the base.
2. The secondary archetype contributes 1-2 specific cues — usually photography handling, copy register, or motion character.
3. Document the blend in the Phase 2 direction file: "Base profile: {dominant}. Modulated by {secondary} via {specific cues}."

Example blends and how they read:
- `warm-trad × neighborhood` — warm-trad palette + neighborhood copy register + owner-led hero
- `polished-pro × engineered` — polished-pro composition + engineered's spec-sheet ServiceCard treatment + minimal motion
- `boutique × neighborhood` — boutique typography + neighborhood photography (real human-scale)

If the extraction returned three or more tags, push back to researcher: vibes that fit three archetypes equally usually mean the existing site has no point of view, in which case the modernization brief needs an explicit positioning question for Pat.

## Spec format (designer Phase 2 direction file additions)

After the existing direction file structure (anti-patterns, color, typography, density, etc.), add this section before motion:

```markdown
## Vibe alignment

### Detected archetype
<dominant tag from research/current-site-vibe.md>
<blend if applicable>

### This direction's archetype
<the archetype this direction commits to — usually matches detected, may modulate via blend>

### Vibe-fit score (this direction vs. detected vibe)
<0-100. Anything below 75 must justify why deviating>

### What this direction PRESERVES from the existing site
<bullet list — voice, photography, color cues, signals>

### What this direction MODERNIZES (dated → current)
<bullet list — execution defaults replaced>

### Over-modernization risk for this archetype
<one paragraph — name the most common failure mode for this archetype and how this direction guards against it>
```

## Three-direction differentiation rule

When producing three Phase 2 directions, they must NOT all map to the same archetype profile — that's not three directions, it's one direction in three skins. Acceptable patterns:

- **Conservative / Modern / Bold within one archetype** — e.g., three flavors of `polished-pro` differing on density, color saturation, motion intensity. Document the axis of variation.
- **One archetype + blend variations** — e.g., A: `warm-trad`; B: `warm-trad × neighborhood`; C: `warm-trad × boutique`. Each blend gives different modern-execution permission.
- **Adjacent archetype proposal** — exactly one direction proposes an adjacent archetype with research justifying why moving the vibe might serve the business better. Other two stay on-vibe.

Rejected pattern: three directions across three unrelated archetypes (e.g., `warm-trad`, `engineered`, `boutique`). That's not modernization, that's a brand-strategy menu — outside engagement scope.

## Verification (designer self-check before submission)

- [ ] Every direction declares its archetype + vibe-fit score
- [ ] Vibe-fit score below 75 has explicit justification
- [ ] The "preserves" list is non-empty
- [ ] The "modernizes" list is non-empty and concrete (not "feels modern" but "replaces stretched-serif headline with weighted Fraunces 56px")
- [ ] The over-modernization risk for this archetype is named
- [ ] Three directions do NOT all map to disjoint archetypes
- [ ] No direction violates the AI-editorial-template anti-pattern lock-list
