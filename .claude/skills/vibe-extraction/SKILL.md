---
name: vibe-extraction
description: Detect a business's existing vibe from its live site, reviews, and category — output structured tags across six axes plus a dominant archetype. Loaded by researcher in Phase 0.5 and by designer in Phase 1. Goal — preserve what the business already IS while modernizing the execution.
---

# Vibe extraction

A business's "vibe" is the felt category a visitor places it in within 3 seconds. Generic modernization that ignores the existing vibe produces a polished site that feels like someone else's business. Vibe-aware modernization keeps the soul and replaces the dated execution.

This skill defines:

1. A taxonomy of six **archetypes** common in service-trade and small-business verticals
2. Six **axes** the archetype is decomposed onto (heritage, density, temperature, formality, signal-strength, owner-presence)
3. A protocol for **extracting** the vibe from a live site
4. The schema for the artifact `research/current-site-vibe.md`

## Six archetypes

Most service-trade and small-business websites cluster into one (or a blend of two) of these. The archetype names are short tags the rest of the system uses — keep them stable.

| Tag | Archetype | Felt category | Common signals on existing site |
|---|---|---|---|
| `warm-trad` | Warm Traditional Trade | Family-run, multi-generational, "since 1947" | Serif type, warm browns/forest greens, photo of owner with truck, "established" badge, hand-set logo |
| `polished-pro` | Polished Modern Trade | Newer business, professional, growing, "licensed and insured" prominent | Clean sans, navy + accent, photo of fleet, callout of certifications, mid-density layout |
| `neighborhood` | Approachable Neighborhood | Friendly, local, owner-on-a-first-name-basis | Rounded type, warm coral/peach, "Ask for Mike", casual copy, low-density |
| `engineered` | Engineered Precision (often B2B) | Technical, industrial, certifications-led | Monospace accents, gray + steel + single accent, schematic illustrations, terse copy |
| `boutique` | Boutique Premium | Upscale, design-forward, higher-priced specialty | Wide-set type, dark or deep-neutral palette, considered photography, low service-count |
| `civic` | Civic / Institutional | Regulated, government-adjacent, trust-via-credentials | Blue + gold or blue + white, formal type, seals/badges, longer-form text |

A single business can read as a blend (`warm-trad × neighborhood`, `polished-pro × engineered`). Record the dominant first, blend second.

## Six axes

The archetype is decomposed onto these continuous axes. Each axis is scored 1-5. Use the axes when the archetype tag alone doesn't capture nuance — and always when proposing modern execution, because modernization preserves axis values while updating the execution.

| Axis | 1 | 3 | 5 |
|---|---|---|---|
| **Heritage** | Brand-new, no history claimed | Some years, low emphasis | Multi-generational, history is the pitch |
| **Density** | Spacious-editorial (1-2 ideas above fold) | Balanced (3-4 ideas) | Dense-utilitarian (5+ ideas; service trade tolerates this well) |
| **Temperature** | Cool (blue/gray, technical) | Neutral (navy + accent) | Warm (browns, oranges, cream, hand) |
| **Formality** | Casual ("Hey, we're Mike & Tom") | Professional (trade-standard) | Formal (institutional, "Our firm has served…") |
| **Signal-strength** | Soft (no badges, modest) | Mid (license + a few logos) | Loud (every certification visible, BBB seal, multi-platform reviews) |
| **Owner-presence** | Anonymous (no faces) | Implied (one team photo) | Owner-led (face on the homepage, name in copy) |

A `warm-trad` business is typically Heritage 4-5, Density 3, Temperature 4-5, Formality 3, Signal 3-4, Owner 4. A `boutique` is Heritage 1-3, Density 1-2, Temperature 1-3, Formality 2-3, Signal 1, Owner 2.

## Extraction protocol (researcher, Phase 0.5)

Run this AFTER Layer 2 (IA + content inventory). 25-40 minutes.

### Step 1 — Live site capture

Open the live site. For each of these surfaces, note one observation:
- **Hero composition** — what's there, in priority order. Photo subject, headline word choices, CTA position.
- **Color** — three dominant colors (eyedropper in DevTools or visual estimate). Hex if available.
- **Typography** — display family if identifiable (or "geometric sans / humanist sans / serif / slab"), body family.
- **Photography** — owner / team / vehicles / equipment / stock-people / installations / none. Noted by category, not count.
- **Copy register** — formal / professional / casual / colloquial. Quote one representative sentence.
- **Trust signals** — license number visible? insurance? BBB? Google rating? years-in-business? Photos of certifications?
- **Owner presence** — owner named? face shown? bio paragraph? "I'm John, I'll answer the phone"?

### Step 2 — Reviews mining for vibe signals

Open `research/reputation-harvest.md` (Phase 0.6). Reviews reveal what customers actually feel about the business — often more reliable than the site's marketing. Look for recurring phrases:

- "On time" / "showed up when they said" → reliability is core
- "Family business" / "second generation" → heritage matters to customers
- "Mike was great" / "asked for [name]" → owner-led brand
- "Best in town" / "go-to in [area]" → neighborhood archetype
- "Worth every penny" / "premium service" → boutique signal
- "Permits" / "code" / "inspector" → civic / engineered orientation
- Tone of reviews themselves (warm / clipped / detailed) mirrors what the business attracts

### Step 3 — Industry baseline

Cross-reference `research/competitive-teardown.md`. What's the modal vibe in this client's vertical + region? The client's vibe sits relative to this baseline:
- **At baseline** — same vibe as competitors. Modernization carries the vibe forward; differentiation comes from execution quality + info density.
- **Below baseline** — visibly less polished than competitors. Modernization has more room; risk is overshooting into a different archetype.
- **Differentiated** — already a distinct vibe for the vertical. Modernization must NOT homogenize — preserve the differentiation.

### Step 4 — Synthesis

Write the artifact at `research/current-site-vibe.md` using the schema below.

## Artifact schema — `research/current-site-vibe.md`

```yaml
---
phase: 0.5-vibe
dispatched: <ISO8601>
client: <client-slug>
---
```

```markdown
# Vibe extraction — {{CLIENT_NAME}}

## Archetype
- **Dominant:** <tag from the six> (confidence: 0-100)
- **Blend (if any):** <tag> (e.g., "warm-trad × neighborhood")

## Axis scores (1-5)
- Heritage:        <score>  (evidence: <one-line>)
- Density:         <score>  (evidence: <one-line>)
- Temperature:     <score>  (evidence: <one-line>)
- Formality:       <score>  (evidence: <one-line>)
- Signal-strength: <score>  (evidence: <one-line>)
- Owner-presence:  <score>  (evidence: <one-line>)

## Live-site signals
- Hero composition: <observation>
- Color: <three dominant colors with hex if known>
- Typography: <display / body categories>
- Photography: <category list>
- Copy register: <category + representative quote>
- Trust signals: <list>
- Owner presence: <observation>

## Reviews-derived signals
<bullet list of recurring phrases and what they imply for vibe>

## Industry baseline
- Vertical modal vibe: <archetype tag>
- This client's position: <at baseline | below baseline | differentiated>
- Implication for modernization: <one paragraph>

## What to PRESERVE
<bullet list — voice, photography subjects, color cues, signal placement that must carry forward>

## What to MODERNIZE
<bullet list — execution defaults that read dated and can be replaced without changing the vibe>

## What to REJECT
<bullet list — generic-AI defaults that the modernization must NOT introduce, named per the anti-pattern lock-list>

## Confidence
<0-100. Below 70 = surface to designer as "needs operator confirmation before locking direction.">
```

## Anti-patterns of this skill

- **Forcing a single archetype tag when the business is genuinely a blend.** Record the blend.
- **Scoring the axes without evidence.** Every axis score has a one-line evidence anchor.
- **Treating the existing vibe as a constraint to fight.** It's the starting position. Modernization preserves the soul; it doesn't impose a new identity.
- **Confusing vibe extraction with brand strategy.** This skill describes what the business currently is. It does NOT recommend a new positioning — that's outside the engagement scope (Pat does brand work separately if asked).
