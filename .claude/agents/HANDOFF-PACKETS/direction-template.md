# HANDOFF_PACKET — Phase 2 direction template

The orchestrator dispatches designer with this packet THREE TIMES (one per direction A, B, C) at Phase 2. Use the YAML frontmatter as-is; substitute `{LETTER}` with A/B/C and the brief context per direction.

The packet is intentionally specific. Designer agents that produce vague directions get the engagement stuck. The Markdown skeleton below is the designer's output template — designer fills each section, NOTHING gets omitted, NOTHING extra prose is added (per the size cap).

---

```yaml
---
agent: designer
phase: 2-direction-{LETTER}
inputs:
  - PROJECT_BRIEF.md
  - research/competitive-teardown.md
  - research/conversion-evidence.md
  - research/current-content-inventory.md
  - research/seo-audit.md
  - research/current-site-strengths.md
  - research/current-site-vibe.md
  - research/reputation-harvest.md
  - design/01-brief.md
  - design/03-ia.md
  - knowledge/wcag.md
  - knowledge/web-perf.md
  - knowledge/conversion.md
acceptance:
  - Output is exactly one file at `design/04-direction-{LETTER}.md`
  - File size ≤ 12KB (load-bearing — unbounded directions hung 50min in a prior engagement)
  - All 13 sections of the template skeleton are present and filled
  - Anti-patterns rejected: 5+ named with rationale, INCLUDING the AI editorial template
  - WCAG AA contrast pairings: every text/bg pair labeled with measured ratio + level
  - Vibe alignment: archetype declared + vibe-fit score (0-100) + preserves/modernizes/risk lists
  - Motion: token values + 3-6 patterns shipped + 3+ patterns rejected + reduced-motion behavior + mobile adaptations
  - Mobile + desktop hero composition specs SEPARATE (not "responsive" hand-waving)
non_goals:
  - Do not produce rationale prose paragraphs anywhere outside the rationale section
  - Do not write hero copy, body copy, CTA microcopy — that's research-derived + operator-edited
  - Do not propose tool stack changes; stack is locked
  - Do not exceed 12KB (load-bearing — TRUE size cap, not advisory)
size_cap: 12288
---
```

---

# Designer's output template — `design/04-direction-{LETTER}.md`

The designer fills this skeleton, in order, completely. The orchestrator + UX agent + Pat all expect this structure exactly.

```markdown
# Direction {LETTER} — {one-line name, e.g. "Warm masthead with verified-trade trim"}

## 1. Vibe alignment
- **Detected archetype** (from `research/current-site-vibe.md`): {warm-trad | polished-pro | neighborhood | engineered | boutique | civic}
- **This direction's archetype**: {tag, may modulate via blend}
- **Vibe-fit score**: {0-100}  (≥75 floor; <75 requires explicit justification below)
- **Preserves from existing site**: {3-5 bullets}
- **Modernizes (dated → current)**: {3-5 bullets, concrete}
- **Over-modernization risk for this archetype**: {one sentence — what failure to guard against}

## 2. Anti-patterns rejected
- {pattern 1}: {one-line rationale citing research or principle}
- {pattern 2}: ...
- {pattern 3}: ...
- {pattern 4}: ...
- {pattern 5}: ...
- The AI editorial template (cream + serif italic + § markers + grain): {rationale specific to this direction}

## 3. Color tokens
| Token | Hex | Usage |
|---|---|---|
| primary | #...... | {usage} |
| primary_deep | #...... | {usage} |
| accent | #...... | {usage} |
| accent_deep | #...... | {usage} |
| ink_primary | #...... | body text |
| ink_secondary | #...... | secondary text |
| ink_mute | #...... | captions, meta |
| surface | #...... | base background |
| surface_warm | #...... | secondary background |
| surface_inverse | #...... | dark sections |
| border_subtle | #...... | dividers, card borders |
| error | #...... | form errors |
| success | #...... | confirmations |

## 4. Contrast pairings (WCAG AA = 4.5:1 body / 3:1 large)
| Foreground | Background | Ratio | Level |
|---|---|---|---|
| ink_primary | surface | x.x:1 | AAA / AA / FAIL |
| surface | primary | x.x:1 | ... |
| accent | surface | x.x:1 | ... |
| ... | ... | ... | ... |

(Every pairing used in any spec section below appears here. AA fail = redo before submission.)

## 5. Typography
- **Display family**: {family name, e.g. Fraunces}
  - Weights: {500, 600, 700}
  - Sizes:
    - h1 mobile: {px}
    - h1 desktop: {px}
    - h2 mobile: {px}
    - h2 desktop: {px}
- **Body family**: {family name, e.g. Inter Tight}
  - Weights: {400, 500}
  - Sizes:
    - body: 16px (mandatory floor)
    - body desktop: {17-18px}
    - small: {14px}
- **Mono family**: {family name, e.g. JetBrains Mono}
  - Used for: caption · tag · spec · process numerals
- **Citation for pairing choice**: {one-line citing readability research from knowledge/conversion.md or research/conversion-evidence.md}

## 6. Hero composition

### Desktop (1280×800)
- Variant: split | centered | photo-led
- Above-fold elements (priority order, top-to-bottom):
  1. {element + position + size}
  2. ...
- LCP element: {what — the heaviest/most visible item the user sees first}

### Mobile (375×667)
- Variant: {usually different from desktop}
- Above-fold elements (priority order):
  1. ...
- LCP element: ...

(Per `frontend-design` SKILL: separate spec, not "responsive" hand-waving.)

## 7. First-scroll information density audit
- **Target**: {X ideas above fold per `design/01-brief.md`}
- **Mobile actual** (count what's above 667px): {N ideas, listed}
- **Desktop actual** (count what's above 800px): {N ideas, listed}
- **Density verdict**: {at-target | under | over} — {one-line action if not at-target}

## 8. Differentiation claim
{One paragraph. How this direction differs from the OTHER TWO Phase 2 directions, AND from the convergent industry default in `research/competitive-teardown.md`. Cite specific competitor patterns being avoided.}

## 9. Reviews treatment
- Placement: {homepage location — above fold | mid-page | dedicated section}
- Format: {tile grid (verbatim, no carousel) | quote pull | other — must NOT be carousel per anti-pattern}
- Schema: every review ships `Review` JSON-LD per `knowledge/seo.md`
- Source attribution format: {e.g. "First Last · Google · 2024-12"}

## 10. Contact-mechanism positioning (text-first per service-trade conversion research)
- Tap-to-call: {position — sticky | hero | both | neither}
- Tap-to-text: {position}
- Form: {position — secondary to call | only contact | absent}
- Mobile-specific overrides: {if any}

## 11. Component implications
Which template components this direction uses, with notes on configuration:
- `<Hero variant="...">`: {notes}
- `<ServiceGrid>`: {notes — column count, icon use}
- `<ReviewsBlock>`: {notes — reviewSourceUrl, count}
- `<TrustStrip>`: {variant: compact | full, signals to display}
- `<ProcessSteps>`: {include? if yes, 4 steps}
- `<AreaPills>`: {include? service area phrase shape}
- `<ContactForm>`: {useEmail flag, preferTextOver flag}
- `<FaqList>`: {homepage, proposal, both}

## 12. Motion (per `motion-design` SKILL)

### Character
{1-2 sentence description tied to this direction's archetype.}

### Token values
- duration_fast: {ms}        # state transitions
- duration_med: {ms}         # tab switch
- duration_reveal: {ms}      # scroll reveal + hero entry
- easing_default: {cubic-bezier or named}
- easing_exit: {cubic-bezier or named}

### Patterns shipped
- {pattern 1}: {element} · {duration} · {easing} · {trigger}
- {pattern 2}: ...
- {pattern 3}: ...
- (3-6 patterns total, each with named JOB)

### Patterns explicitly rejected (3+ from motion-design SKILL anti-pattern list)
- {pattern}: {one-line why this direction rejects it}
- ...

### Reduced-motion behavior
{One paragraph: what is disabled, what stays. Reference the SiteLayout.astro global rule.}

### Mobile adaptations
- Durations reduced by ~25% from desktop values above
- {any mobile-specific pattern changes}

## 13. Production gates checklist (designer self-check before submission)
- [ ] All 13 sections filled, no "TBD"
- [ ] File size ≤12KB
- [ ] 5+ anti-patterns rejected, includes AI editorial
- [ ] Every contrast pairing in section 4 has measured ratio
- [ ] Every text/bg pairing used in any section appears in section 4
- [ ] Body text ≥16px every variant
- [ ] Vibe-fit ≥75 OR justified <75 in section 1
- [ ] Mobile + desktop hero composition spec separate (section 6)
- [ ] Motion section 12 complete with all 5 sub-headings
- [ ] No invented copy anywhere; placeholder copy explicitly labeled `(placeholder — not for ship)`
```

---

## When to deviate

Only deviate from the 13-section structure when the dispatch packet's `acceptance:` block explicitly relaxes a requirement. The structure is binding because:
- UX cross-review (`05-ux-review-of-directions.md`) compares directions section-by-section
- Phase 3 tokens authoring depends on sections 3, 4, 5
- Phase 4 build dispatches reference section 11 component implications + section 12 motion
- Pat's Phase 7 redirect-decision reads section 1 + section 8 + section 6

A direction missing any section forces re-dispatch and burns minutes.

## What this packet does NOT cover

- Phase 1 brief authoring — see different packet
- Phase 3 tokens authoring — see `design-md` SKILL
- Phase 4 component implementation — orchestrator-driven, not designer
