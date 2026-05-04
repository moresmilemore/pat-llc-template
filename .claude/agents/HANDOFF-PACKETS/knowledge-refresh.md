# HANDOFF_PACKET — knowledge refresh

The orchestrator dispatches researcher with this packet at Phase 0 when `npm run knowledge:check` reports any file >30 days stale, OR at any retrospective when standards have visibly shifted (e.g. a major Astro release).

Customize the `inputs:` block per dispatch — list the specific stale files and their canonical sources.

---

```yaml
---
agent: researcher
phase: knowledge-refresh
inputs:
  - knowledge/web-perf.md
  - knowledge/wcag.md
  - knowledge/astro.md
  - knowledge/seo.md
  - knowledge/conversion.md
  - knowledge/motion.md
  - knowledge/tooling.md
acceptance:
  - Each file's `refreshed:` date is updated to today's ISO date if any content changed
  - Each file's `sources:` list verified — broken links replaced or removed with rationale
  - New findings appended under `## Updates {YYYY-MM-DD}` sections, not silently inlined into older sections
  - Deprecated practices marked `~~strikethrough~~ (deprecated YYYY-MM-DD: replaced by X)` and kept for one cycle before deletion
  - Anti-cite list (in conversion.md) verified — no new vendor-biased sources slipped in
non_goals:
  - Do not editorialize. Bullets, tables, code snippets. Plain language.
  - Do not invent statistics. Every number is sourced or removed.
  - Do not rewrite for style. Surface real new content; preserve voice.
size_cap: 8KB total delta across all files (this is a refresh, not a rewrite)
---

# Mission
Refresh the Pat LLC `knowledge/` directory so the agents work from current-as-of-today references on the next engagement. Standards drift; this is the maintenance loop.

# Context
The knowledge base ships with the Pat LLC template. Each file has a `refreshed:` ISO date in YAML frontmatter. The agents read the relevant file as the third action of every dispatch, and they trust the file over training-data residue. If the file is stale, every downstream artifact inherits the staleness.

Run `npm run knowledge:check` first to confirm which files are actually stale. Skip files <30 days old unless the dispatch explicitly names them.

# Deliverables
- Updated `knowledge/*.md` files with current information and bumped `refreshed:` dates
- A short summary at `knowledge/_refresh-{YYYY-MM-DD}.md` listing what changed per file (one paragraph each)

# Quality bar
Per BASE-AGENT.md §2 evidence labels — every fact in the refresh is VERIFIED (observed live), CITED (URL + retrieval date), or labeled INFERRED if drawn from cited facts. No ASSUMED facts in knowledge files.

Per `research-methodology` SKILL — source hierarchy applies: peer-reviewed > vendor docs > standards bodies > industry reports > expert practitioners > third-party blogs.

Durability test on every claim: "Will this be true in 6 months?" If no, label VOLATILE in the file.

# Refresh procedure per file

For each file:

1. Open the file. Read existing content. Note `refreshed:` date.
2. Open each URL in `sources:` block. Verify still resolves; if broken, find replacement on same domain or note removal.
3. WebSearch: `"<topic>" current best practices 2026` and `"<topic>" what's new 2025`. Filter for sources from the source-hierarchy list.
4. For each new finding worth including: append under a `## Updates {YYYY-MM-DD}` section. Don't silently rewrite older sections; let the deltas accumulate visibly so future refreshes can audit drift.
5. For each old finding now superseded: mark `~~strikethrough~~` with replacement notation. Keep for one refresh cycle.
6. For each old finding still valid: leave as-is. Don't rewrite for style.
7. Bump `refreshed:` to today's ISO date.

# Per-file source priorities

- `web-perf.md` — web.dev articles + Chrome blog + INP / LCP / CLS official spec
- `wcag.md` — W3C WCAG 2.2 + WCAG 3.0 status; DOJ + EU enforcement updates; WebAIM
- `astro.md` — Astro docs + changelog + blog; Vite changelog for major version bumps
- `seo.md` — Google Search Central + developers.google.com; verify nothing migrated to AI Overviews territory
- `conversion.md` — Baymard, Nielsen Norman, CXL Institute (paid content excerpts OK as cite-with-summary)
- `motion.md` — web.dev animation articles + WCAG motion criteria; verify scroll-driven animations API status
- `tooling.md` — vendor changelogs (Vercel, Resend, Stripe, Cloudflare Turnstile)

# When a finding contradicts existing content

Older content stays unless the new evidence is at a higher source tier. If equal tier, present both with dates and let the operator decide via Pat LLC retrospective.
```

---

## When to dispatch

- Phase 0 of any engagement where `knowledge:check` reports stale files (orchestrator dispatches automatically)
- Phase 8 retrospective when an engagement surfaced "the knowledge file disagrees with what I observed today" — orchestrator queues for next cycle
- Quarterly catch-up dispatch — orchestrator can run this manually outside an engagement to keep the template repo current

## Cost / time estimate

Per file: 10-15 minutes for genuine review + WebFetch verification. Full refresh of 7 files: 70-100 minutes. Researcher dispatches at this scope are bounded.
