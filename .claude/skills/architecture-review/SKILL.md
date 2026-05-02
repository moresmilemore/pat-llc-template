---
name: architecture-review
description: Decision-Centric Architecture Review (DCAR) — quality attributes, server-vs-client component decisions for Astro, coupling and dependency analysis. Pass 1 of the developer agent's three-skill review.
---

# Architecture review (DCAR)

Run as the FIRST pass of developer agent review. Findings here often invalidate the rest of the review — get them surfaced fast.

## Decision-centric framing

Every diff embodies one or more architectural decisions. List them before evaluating. Common decisions in this stack:

- Server-rendered vs client island vs static
- Data location (frontmatter, content collection, env, runtime fetch)
- Component scope (page-local, shared, layout-level)
- Style strategy (Tailwind utility, scoped block, `:root` token)
- New dependency vs built-in
- Caching strategy (static at build, ISR, runtime)
- Route structure (single route, dynamic route, programmatic getStaticPaths)

For each decision, ask: was this decision deliberate? Does it match the established repo pattern? If it deviates, is the deviation justified by the diff's stated purpose?

## Quality attributes (score each 0-5)

| Attribute | What to evaluate |
|---|---|
| Security | Are surfaces minimized? Inputs validated? Secrets isolated? |
| Maintainability | Will another agent (or Pat) understand this in 6 months? |
| Performance | Is the critical path lean? Bundle impact justified? |
| Scalability | Does this work at 100 routes, 1000 routes? |
| Cost | API calls, build time, deploy size — within budget? |

Score below 3 on any attribute = file finding with severity matched to risk.

## Astro server-vs-client decision rules

Default: SERVER. Astro's strength is shipping zero JS.

Move to CLIENT (`<Component client:load />` or `client:visible` etc.) only when:
- The interaction requires runtime state changes (a tabbed interface, a form with live validation)
- The interaction depends on user-only data (current scroll position, viewport, geolocation)
- Third-party scripts require it (Stripe Checkout iframe, Calendly embed)

Never CLIENT for:
- Static content (always SERVER)
- Hover effects (CSS-only)
- Reveal-on-scroll animations (CSS animation + Intersection Observer is fine, but most can be CSS-only)
- Anything that could be done at build time

When CLIENT is justified, use the most conservative directive:
- `client:visible` (waits until in viewport) > `client:idle` (waits for browser idle) > `client:load` (loads ASAP)
- Never `client:only` unless the component genuinely cannot SSR

## Coupling check

- Does this change couple two modules that should be independent? (e.g. a layout importing a page-specific component)
- Does this change introduce a dependency cycle? (build will catch outright cycles; subtle cycles via dynamic imports are findings)
- Does this change make the orchestrator's per-client edits harder? (e.g. inlining client-specific values into a layout instead of templating them)

## Dependency direction

- Layouts can import components. Components cannot import layouts.
- Pages can import components + layouts. Components cannot import pages.
- Data files (`src/data/*.ts`) can be imported anywhere. Nothing imports back into data files.
- Content collections (`src/content/*`) are read via Astro's `getCollection()`, not direct file reads.

Violations = MAJOR finding minimum.

## Output

Findings format per BASE-AGENT.md §6. End with quality-attribute scorecard:

```
Security:        N/5
Maintainability: N/5
Performance:     N/5
Scalability:     N/5
Cost:            N/5
```
