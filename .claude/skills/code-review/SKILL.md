---
name: code-review
description: Developer agent's code-quality protocol — 7-phase review with 0-100 confidence scoring and APPROVED/CHANGES_REQUESTED/BLOCKED verdicts. Pass 3 of the developer agent's three-skill review.
---

# Code review

Run after architecture-review and security-review have completed for the same diff.

## 7 phases

### Phase 1 — Scope assessment
What did the diff actually do? Read it line by line. List the files touched, the LOC delta, the symbols added/removed. If the diff doesn't match the orchestrator's stated intent, file a finding before going further.

### Phase 2 — Render path verification
For Astro components: is this island, server-rendered, or static? Trace the data flow:
- Where does data come from (frontmatter, props, fetch, env)?
- Where does it render (build-time HTML, hydrated island, client fetch)?
- What ships to the browser (HTML only, HTML + JS, HTML + JS + state)?

If client-side JS isn't necessary, file a finding — Astro's strength is shipping zero JS by default.

### Phase 3 — Convention check
Compare against the repo's existing patterns:
- Naming (kebab-case files, PascalCase components, camelCase functions)
- Import ordering (external → internal → relative)
- File structure (components colocated, layouts in `src/layouts/`, pages in `src/pages/`)
- Style approach (CSS in `:root`, Tailwind utility, scoped `<style>` block)
- Type usage (TS interfaces vs types, Astro.props typing, content collection schemas)

Convention violations are MAJOR if load-bearing, MINOR if cosmetic.

### Phase 4 — Security (delegated to security-review skill)
Already performed by Pass 2. Reference findings; do not duplicate.

### Phase 5 — Functional review
- Logic correctness — does the code do what it claims?
- Edge cases — empty array, null, missing prop, slow fetch, build-time vs runtime data
- Error handling — does failure leak raw error details to the browser? (Pat preference: never)
- Type safety — any `any` introduced? Any unchecked assertions?

### Phase 6 — Dependency audit
If a new dependency was added:
- Is it maintained (commits in last 90 days)?
- Is it popular (>50 weekly downloads, used by frameworks Pat trusts)?
- Is it audit-clean (`npm audit` clean for this dep)?
- Is there a smaller alternative or built-in that does the same?
- Does it ship with TypeScript types?

If new dep is unjustified (exists for a problem already solved by existing code or a built-in), file MAJOR.

### Phase 7 — Performance impact
- Bundle size delta — `npm run build` and read the output. Did first-load JS grow? Why?
- Image optimization — are images Astro `<Image>` components or raw `<img>`? Are they served from `/public/img/optimized/` or unprocessed?
- Font loading — are new fonts using `font-display: swap`? Are they self-hosted or external?
- Render path — is anything blocking the critical path that doesn't need to?

## Confidence scoring (0-100)

- 40 pts: Did you read the actual diff?
- 30 pts: Did you trace the code/render path?
- 20 pts: Did you verify against documentation or similar code in the repo?
- 10 pts: Did you find supporting evidence (test, type, lint, build output)?

Findings <80 are LOW_CONFIDENCE — surfaced but non-blocking.

## Comments policy

When reviewing code, flag any comment that:
- Explains WHAT the code does (delete — names should explain)
- Names the current task or PR ("added for issue #123" — belongs in commit message, rots fast)
- Restates the function signature

Keep only comments that explain WHY the non-obvious choice exists.

## Verdict

Per BASE-AGENT.md §6:
- Any CRITICAL ≥80 confidence → BLOCKED
- 3+ MAJOR (any confidence ≥70) → CHANGES_REQUESTED
- Confidence overall <80 with non-zero MAJOR → CHANGES_REQUESTED
- Otherwise → APPROVED
