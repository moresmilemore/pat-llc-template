---
name: frontend-design
description: Production-grade frontend output discipline. Aesthetic baseline — bold direction, distinctive typography, atmospheric backgrounds, motion vocabulary. Explicit reject list of generic AI aesthetics. Loaded by designer agent always.
license: Apache-2.0
source: vendored from Anthropic skills repo (synthesized from kit description; replace with verbatim when available)
---

# Frontend design discipline

## Aesthetic baseline

Production frontend work must read as crafted, not templated. The baseline:

- **Bold direction** — every page has a clear visual point of view. If a stranger could swap the brand and the page would still work, the design has no point of view.
- **Distinctive typography** — type pairing chosen deliberately, not by autopilot. Display family signals industry + tone; body family optimized for readability at the medium reading distance (16-17px on phones held 30cm from face).
- **Atmospheric backgrounds** — surfaces feel material, not flat. Subtle texture, gradient direction, or depth via shadow + offset. Never pure `#FFFFFF` body background unless intentional and named.
- **Motion vocabulary** — motion is restrained and signature. Every animation has a purpose (state transition, scroll reveal). Idle motion (loops, decorative animations) is avoided unless the brand requires it.

## Reject list (generic AI aesthetics)

Frontend output must reject these defaults explicitly:

- **Generic AI sans pairings**: Inter + Roboto, Inter + Montserrat, Inter + anything-else without rationale. If using Inter, name why.
- **Purple-to-pink gradient hero on white** — the OpenAI / generic SaaS / late-2020s template look.
- **Predictable three-feature-card row** under the hero.
- **Stock photography** of smiling people in hard hats / business attire / generic office settings.
- **Lottie hero animations** that don't load below 50KB.
- **The "AI editorial template"** — warm cream background + serif italic accents + § numbered section markers + grain overlay + asymmetric magazine layout. (Binding rejection per BASE-AGENT.md §7.)
- **Centered hero with one big H1 + one paragraph + one button**, no other compositional choice made.
- **"Trusted by" logo bar** without actual partnerships.
- **Carousel testimonials** — verbatim review tile grid is always better.

## Composition principles

- **Asymmetry serves a point** — symmetric layouts read corporate; asymmetric layouts must justify the weight imbalance.
- **One face per page** — if there's a hero photo of the owner, the rest of the page should reinforce that personal-trust frame, not contradict it.
- **Information density matches audience** — service-trade audiences (plumbers, roofers, electricians) tolerate more density than D2C consumer-product audiences. First-scroll mobile should communicate ≥3 things, not 1.
- **Contrast at the structural level, not just text** — surface vs accent vs ink is a three-tier system. Two-tier (white + ink only) reads thin.

## Typography pairings

Cite a research source for any pairing choice. Examples that work for service-trade verticals:

- Display: Fraunces (variable, expressive when needed, sober otherwise) + Body: Inter Tight (compact, dense)
- Display: Source Serif 4 + Body: Source Sans 3 (utilitarian, civic)
- Display: Recoleta + Body: Söhne (premium service)
- Display: Bricolage Grotesque + Body: Geist (modern + technical)

Avoid: Playfair Display (overused), Open Sans (too generic), Lato (dated).

## Motion vocabulary

When motion is used:
- 200-400ms duration for state transitions (hover, focus, click)
- 600-900ms for scroll-reveal entrance
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` for entrances; `ease-out` for exits
- Respect `prefers-reduced-motion`: every animation disabled when set

## Production gates (binding)

Before any direction proposal ships:
- 5+ anti-patterns explicitly rejected with rationale
- WCAG AA contrast on every text/bg pairing
- Mobile + desktop hero composition spec separate (not "responsive" hand-waving)
- Differentiation claim vs the other two directions stated in one paragraph

---

*This is a synthesized version of the Anthropic frontend-design skill. License Apache-2.0. Replace with the verbatim upstream skill when the inventory file becomes available.*
