---
name: motion-design
description: Animation discipline for production UI — when to animate, how long, what easing, what to never animate, mobile + reduced-motion handling, performance budgets. Loaded by designer (Phase 2 + Phase 3) and ux (visual review). Goal — smooth, signature, restrained motion that supports the chosen vibe.
---

# Motion design

Smart, smooth animations are restrained. The wrong amount of motion makes a site feel cheap, slow, or seizure-inducing — the right amount makes it feel responsive, crafted, and quietly modern. This skill is the discipline.

## First principle

**Every animation has a job.** State transitions communicate change; scroll reveals signal "there's more here"; hover/focus communicate interactivity. Decoration that loops, parallax that exists for parallax's sake, particles, marquees — these are noise.

If you cannot name the job an animation does in one sentence, delete it.

## Motion philosophy by archetype

The vibe (`research/current-site-vibe.md`) determines motion character. Each archetype has a default motion profile:

| Archetype | Character | Typical durations | Easing default |
|---|---|---|---|
| `warm-trad` | Slow, considered, gravity-respecting | 300-500ms state, 700-900ms reveal | `cubic-bezier(0.22, 1, 0.36, 1)` (settles) |
| `polished-pro` | Crisp, brisk, professional | 180-250ms state, 500-700ms reveal | `cubic-bezier(0.4, 0, 0.2, 1)` (material standard) |
| `neighborhood` | Soft, gentle, friendly | 250-350ms state, 600-800ms reveal | `cubic-bezier(0.34, 1.2, 0.64, 1)` (mild overshoot ≤8%) |
| `engineered` | Minimal, mechanical, near-zero | 120-180ms state, NO scroll reveals | `linear` or `ease-out` |
| `boutique` | Slow, expensive-feeling, fade-led | 350-500ms state, 800-1100ms reveal | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `civic` | Functional only, no decoration | 150-200ms state, NO scroll reveals | `ease-out` |

These are defaults. The Phase 2 direction file documents motion choices — designer may deviate with rationale.

## Canonical patterns (use these)

These are the only patterns that should ship without explicit operator approval. Each maps to a job.

### State transitions (interactive elements)

**Hover on cards / buttons / nav items**
- Property: `background-color`, `color`, optionally `box-shadow`
- Duration: per archetype (180-500ms)
- Easing: archetype default
- Touch devices: do NOT trigger on touch; use `:active` instead with 100ms scale or color shift

**Focus ring**
- Appears instantly on `:focus-visible` (no transition in)
- Fades out 150ms on `:blur`
- Always visible — never use `outline: none` without an explicit replacement

**Active / pressed**
- Property: `transform: scale(0.97)` or 5-10% darker background
- Duration: 100ms in, 200ms out
- For tap targets on mobile, this is the affordance for "I tapped it"

**Tab switch (within page)**
- Cross-fade content: 200-250ms opacity
- Do NOT slide horizontally (motion-sickness risk + breaks scroll position)

### Entry / reveal

**Hero subhead fade-in**
- Trigger: page load complete
- Property: `opacity 0 → 1`, optional `translateY(8px) → 0`
- Duration: per archetype (500-1100ms)
- Once only — do not re-trigger

**Scroll-triggered reveal (below-fold sections)**
- Trigger: IntersectionObserver, threshold 0.15
- Property: `opacity 0 → 1`, optional `translateY(16px) → 0`
- Duration: archetype reveal duration
- Once only (`unobserve` after first trigger)
- Stagger children by 60-120ms if a list

**Number counter (review count, years-in-business)**
- Only if the number is a load-bearing trust signal
- Duration: 1000-1400ms count-up
- Trigger: IntersectionObserver
- Easing: `ease-out`
- Skip on `prefers-reduced-motion` — show the final number immediately

### Persistent

**Sticky nav state**
- Property: `box-shadow` and `backdrop-filter` appear once user scrolls past 80px
- Transition: 200ms ease-out
- Reverses on scroll-to-top

**Smooth scroll on anchor click**
- `scroll-behavior: smooth` in CSS (not JS)
- Disabled by `prefers-reduced-motion` automatically

### Page-level

**Astro static — no client-side page transitions** unless explicitly enabled via Astro view transitions (and even then, only with operator approval per direction). Page reload is the transition.

## Anti-patterns (never ship these)

| Anti-pattern | Why it fails |
|---|---|
| Auto-rotating carousel for testimonials | Removes user agency, hides content, accessibility-hostile |
| Marquee / ticker | Distracts from real content; reads as ad-tech |
| Parallax beyond 8px translate range | Motion sickness; degrades scroll perf |
| Bouncy/elastic easing (overshoot >15%) | Reads as toy or game, not service business |
| Letter-by-letter type-on hero | Delays comprehension; perceived slowness |
| Auto-playing video hero with sound | Accessibility violation + bandwidth |
| Particle systems / decorative loops | Ambient noise; battery drain on mobile |
| Hover-triggered modal preview | Dark pattern; not touch-compatible |
| Lottie >50KB | LCP impact |
| Auto-cycling gradient backgrounds | Distracting; battery drain |
| Scroll-jacking / forced scroll-snap on long pages | User loses control of scroll velocity |
| Cursor trail / custom cursor effects | Unnecessary; hostile on touch devices |
| Animated SVG illustrations >500ms loop | Decoration without function |
| `transition: all` on any element | Animates properties you didn't intend (size, color, layout) |

## Mobile considerations

- **Reduce duration by ~25% from desktop** — mobile users scroll faster; longer animations feel sluggish
- **Disable scroll-reveal in the first viewport** — animation during initial paint hurts LCP
- **Avoid scroll-driven animation** (`@scroll-driven` / scroll-linked) on mobile — battery + perf
- **Touch states use color/scale, never hover-style elevation** — no shadow-grow on tap
- **44px minimum tap target unaffected by motion** — animated padding/scale must keep the hit area ≥44px

## Reduced-motion (mandatory)

`prefers-reduced-motion: reduce` MUST disable:
- All scroll-triggered reveals (show content statically)
- All decorative loops
- All transform-based entrance animations (set final state immediately)
- Number counters (jump to final)

What stays even with reduced-motion:
- Color/background state transitions ≤200ms (still useful as feedback)
- Focus ring transitions
- Smooth scroll (browser handles this automatically)

CSS pattern:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Performance budgets (binding)

- **Frame budget: 16.67ms** (60fps). Animations that drop below cost UX directly.
- **Animate only `transform` and `opacity`** — these are GPU-composited. Animating `width`, `height`, `top`, `left`, `margin` triggers layout and is a perf failure.
- **No JS animation for elements >100×100px** unless using `transform`. CSS handles it.
- **No scroll listener-based animations.** Use `IntersectionObserver` (one-shot) or `view-timeline` (one-time, non-blocking).
- **Lottie cap: 50KB** decoded, with rationale. Prefer SVG sprite + CSS over Lottie for ≤3-state icons.
- **Total motion-related JS shipped: ≤8KB gzipped** for the entire site, excluding any explicit hero animation library.

## Spec format (designer Phase 2 direction file additions)

Every Phase 2 direction file includes this `## Motion` section after the typography section:

```markdown
## Motion

### Character
<archetype-aligned description, 1-2 sentences>

### Token values
- duration_fast:  <ms>     (state transitions)
- duration_med:   <ms>     (longer state, e.g. tab switch)
- duration_reveal:<ms>     (scroll reveals + hero entry)
- easing_default: <cubic-bezier or named>
- easing_exit:    <cubic-bezier or named>

### Patterns shipped
- <pattern>: <element> · <duration> · <easing> · <trigger>
- <pattern>: <element> · <duration> · <easing> · <trigger>
- ... (3-6 max)

### Patterns explicitly rejected (from this skill's anti-pattern list)
- <pattern>: <one-line rationale>
- ... (3+ minimum from the anti-pattern list)

### Reduced-motion behavior
<one paragraph: what's disabled, what stays>

### Mobile adaptations
<bullet list of how durations / triggers differ on mobile>
```

## Verification checklist (designer self-check + ux review gate)

Before a direction's motion section is considered complete:

- [ ] Every pattern has a named job (state / reveal / persistent / page)
- [ ] Total animations on the homepage ≤ 8 distinct triggers
- [ ] Every animation lists `prefers-reduced-motion` behavior
- [ ] No `transition: all` anywhere in the spec
- [ ] No animation duration >1100ms on mobile (without rationale)
- [ ] Mobile reduces durations vs desktop
- [ ] Hero entry animation respects LCP (does NOT delay LCP element appearance)
- [ ] Sticky nav transition doesn't depend on scroll-listener loop
- [ ] No carousel / marquee / parallax / particle pattern listed
