---
purpose: agent-readable current-best-practices references
refreshed: 2026-05-04
refresh_cadence: 30 days (auto-checked at Phase 0)
---

# Knowledge base

Curated, current-as-of-{refreshed} reference docs the agents read **before** specialized work, so their decisions reflect 2026 best practices, not 2024 training-data residue.

## Why this exists

Skills (`.claude/skills/*/SKILL.md`) define **how** the agents work — durable methodology that rarely changes. This knowledge base captures **what's currently true** in the world of web standards, performance budgets, accessibility law, conversion research, and tooling — fast-moving facts that go stale in months.

Agents read the relevant knowledge file as part of dispatch setup (after BASE-AGENT.md, after their own role spec, after their lessons file). When the orchestrator dispatches a researcher for conversion-evidence, the researcher reads `knowledge/conversion.md` first to know the current authoritative sources to cite.

## Files

| File | Topic | Read by |
|---|---|---|
| `astro.md` | Astro 5+ patterns, breaking changes, current best practices for static sites | designer, developer |
| `web-perf.md` | Core Web Vitals + Lighthouse current thresholds + measurement methodology | designer, developer, qa |
| `wcag.md` | WCAG 2.2 + 3.0 status, AA criteria the build must meet, audit tooling | designer, ux, qa, developer |
| `seo.md` | Current Google ranking factors for service-trade verticals + schema patterns | researcher, developer |
| `conversion.md` | Recent conversion / eye-tracking research (Baymard, NN/g, CXL) | researcher, designer, ux |
| `motion.md` | Current motion accessibility guidelines + perf research | designer, ux |
| `tooling.md` | Pat LLC's stack version pins + recent vendor changes (Astro / Vercel / Stripe / Resend / Turnstile) | developer, qa, orchestrator |

## Refresh protocol

The orchestrator checks staleness at Phase 0:

```bash
# Each knowledge file's frontmatter has a `refreshed:` ISO date.
# If any file is >30 days old, run:
npm run refresh:knowledge
```

The refresh script (`scripts/refresh-knowledge.mjs`) uses WebFetch (via the orchestrator's tools, not as a Node-native dep) to pull from canonical sources:

- Astro changelog (https://docs.astro.build/en/guides/upgrade-to/v5/)
- web.dev Core Web Vitals (https://web.dev/articles/vitals)
- W3C WCAG 2.2 (https://www.w3.org/TR/WCAG22/)
- Google Search Central (https://developers.google.com/search/docs)
- Baymard Institute summaries
- Vercel changelog, Stripe changelog, Resend changelog

Manual refresh path: open the relevant knowledge file, update `refreshed:` to today, append any new findings under a `## Updates {YYYY-MM-DD}` section, prune stale items from older sections.

## Editing rules

1. **Cite every claim.** Each fact has an inline link. Untraceable claims are removed.
2. **Date every section.** A section without a `_dated YYYY-MM-DD_` footer is presumed older than the file's `refreshed:` date.
3. **Mark deprecation.** Old practices that are no longer current get a `~~strikethrough~~ (deprecated YYYY-MM-DD: replaced by X)` line, kept for a refresh cycle, then deleted.
4. **No prose for the sake of prose.** Agents read these fast — bullets, tables, code snippets. No editorial-style introductions.
