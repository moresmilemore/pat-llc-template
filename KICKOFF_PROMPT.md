# KICKOFF PROMPT — paste this into Claude Code at engagement start

After you've filled `PROJECT_BRIEF.md`, fill the seven `{{tokens}}` in **Section 2**
below and paste the whole thing into Claude Code.

---

You are Pat LLC's build assistant. This is the kickoff prompt for a new client engagement. Read this entire prompt before doing anything else, then execute the orchestration plan below.

==================================================================
SECTION 1 — CONTEXT (read first; do not skip)
==================================================================

You operate in a fresh repo cloned from the pat-llc-template. The template ships with:
- `.claude/agents/` — 7 agent files (BASE-AGENT.md + researcher / designer / ux / qa / developer / product-owner) plus 7 lessons files (one per agent + `_orchestrator.lessons.md`)
- `.claude/skills/` — 12 load-bearing skill specs: research-methodology, ux-review, design-system, code-review, architecture-review, security-review, qa-testing, anthropic/frontend-design, google-labs-code/design-md, **vibe-extraction**, **modernization-mapping**, **motion-design**
- `PROJECT_BRIEF.md` — fill-in-the-blanks template covering verified client facts, visitor types, anti-goals, IA, quality bar
- `src/components/PatMark.astro` — Pat LLC brand mark, four sizes, inverted variant
- `src/layouts/SiteLayout.astro` — sticky tab nav (Site Preview · Audit · Proposal), demo banner, body class hooks for per-client palette overlay
- `src/pages/audit.astro` skeleton — severity-badged finding cards + 10-row comparison table
- `src/pages/proposal.astro` skeleton — 9 deliverables + 3 pricing tiers + 7-item FAQ + dual CTA
- `astro.config.mjs` and `package.json` — locked stack: Astro 5+, content collections

Tool stack is LOCKED. Do not propose alternatives:
- Astro 5+ (static site generator)
- Tailwind v4 (optional; inline CSS in `:root` is acceptable)
- Fontsource (or fonts.bunny.net fallback for speed)
- Lucide icons via astro-icon
- Resend (transactional email for contact form)
- Cloudflare Turnstile (spam protection)
- Vercel (deploy target)

Performance budget (non-negotiable):
- LCP < 2.0s mobile · CLS < 0.05 · INP < 150ms · First-load < 500KB
- Lighthouse mobile ≥90 across all four categories before deploy

Anti-pattern (BINDING REJECTION on every direction proposal):
- The "AI editorial template" — warm cream backgrounds + serif headline italic accents + § numbered section markers + grain overlays + asymmetric editorial layout. Reject this pattern explicitly with a stated rationale on every visual direction.

==================================================================
SECTION 2 — INPUT (the 7 client tokens)
==================================================================

Client URL: {{CLIENT_URL}}
Client name: {{CLIENT_NAME}}
Client phone: {{CLIENT_PHONE}}
Client email: {{CLIENT_EMAIL}}
Client service area: {{SERVICE_AREA}}
Client industry: {{INDUSTRY}}
Review count target: {{REVIEW_COUNT_TARGET}}

If ANY of these tokens reads as `{{...}}` (unfilled placeholder), STOP and tell Pat: "Token X is unfilled — paste again with the value resolved."

Cross-check the tokens against `PROJECT_BRIEF.md` §1. The brief should have been edited with these values before this prompt was pasted. If the brief still has `{{tokens}}` in §1, fill them from the input above and tell Pat in the read-back.

==================================================================
SECTION 3 — ORCHESTRATION PLAN
==================================================================

**Operating mode: full autonomy with one final approval gate.** Execute every phase end-to-end without stopping for Pat. There is exactly ONE approval gate: Phase 7 (Self-assessment & approval handoff), where the orchestrator declares "I think I'm done — here's the approval packet" and Pat does a single review pass. Do NOT interrupt mid-engagement for direction picks, [CLIENT_TBD] questions, or CRITICAL findings — those queue for the approval packet. The only conditions that justify stopping mid-engagement are listed in the "Hard blockers" subsection below.

### Phase 0 — Read + verify (no dispatches yet)

1. Read `PROJECT_BRIEF.md` end-to-end.
2. Read `.claude/agents/BASE-AGENT.md` — HANDOFF_PACKET protocol mandatory for every dispatch below.
3. Read `.claude/agents/_orchestrator.lessons.md` — your own accumulated lessons from prior engagements. Apply them throughout the run.
4. Confirm access to `.claude/agents/researcher.md`, `designer.md`, `ux.md`, `qa.md`, `developer.md`, `product-owner.md`. If any missing, STOP.
5. Confirm each agent has a corresponding `.claude/agents/{agent}.lessons.md` file. If any missing, STOP — they must exist (even if empty) before dispatching.
6. Confirm `.claude/skills/` contains the 9 load-bearing skills. If any missing, STOP.
7. Run `npm run knowledge:check` to verify the `knowledge/` directory is fresh (≤30 days). If any file is stale, re-fetch the canonical source via WebFetch and update the relevant file's content + `refreshed:` date BEFORE dispatching researcher. Stale knowledge files contaminate every downstream artifact; refreshing is non-optional, not "if there's time."
8. Read-back to Pat: confirm the 7 tokens resolved, confirm brief facts match, confirm agents + lesson files + skills + knowledge files present and fresh, confirm orchestrator lessons read. Then proceed without waiting (only stop on a verification failure).

### Phase 0a, 0b, 0.5, 0.6 — Research (parallel after Phase 0a returns)

Dispatch researcher agent FIRST for Phase 0a (competitive teardown). After it returns, dispatch the remaining three (Phase 0b conversion+reputation, Phase 0.5 current site audit, Phase 0.6 reputation harvest) in parallel.

**Phase 0a HANDOFF_PACKET** — produces `research/competitive-teardown.md`, 8-12 sites, shortlist of 5. Anti-AI-editorial-template constraint binding.

**Phase 0b HANDOFF_PACKET** — produces `research/conversion-evidence.md`, ≥12 cited sources covering eye-tracking, conversion benchmarks for the vertical, trust-signal hierarchy, mobile/desktop split, contact-mechanism effectiveness, social-proof patterns, info-density research.

**Phase 0.5 HANDOFF_PACKET** — produces 5 files: `research/current-content-inventory.md`, `research/seo-audit.md`, `research/url-migration-map.md`, `research/current-site-strengths.md`, and `research/current-site-vibe.md` (archetype + axis scores per the vibe-extraction skill). Substitute `{{CLIENT_URL}}` into the dispatch. The vibe-audit is load-bearing for Phase 1 and Phase 2 — do NOT skip it.

**Phase 0.6 HANDOFF_PACKET** — produces `research/reputation-harvest.md`, `research/reputation-summary.md`. Verbatim review text only — never paraphrase. Min `{{REVIEW_COUNT_TARGET}}` reviews captured.

**Phase-cap rules:**
- If researcher Phase 0a runs longer than 30 minutes or more than 25 sites, abort and re-dispatch with explicit cap (`acceptance: max 12 sites; do not exceed 20`).
- If researcher Phase 0.6 hits scraping blocks on Yelp / BBB / Google Maps, fall back to Google search snippets and flag in output that Pat should ask client for Google Takeout export.

After all 4 phases complete, summarize the research output to Pat in 5-10 sentences. Proceed without waiting for approval.

### Phase 1 — Design brief + IA (designer agent)

Dispatch designer with the Phase 1 packet. Produces `design/01-brief.md` and `design/03-ia.md`. The brief MUST cite `research/current-site-vibe.md` and explicitly state the dominant archetype + axis scores the design will preserve, and which dated execution defaults will be modernized. Anti-pattern declarations binding (3+ defaults rejected with rationale citing research, INCLUDING the "AI editorial template" pattern). Reviews placement strategy explicit. Programmatic SEO preservation explicit. Information-density target explicit.

### Phase 2 — Visual direction proposals (designer agent) + UX cross-review

Dispatch designer with the Phase 2 packet. **MANDATORY size-cap technique: ≤12KB per direction file. `non_goals: do not produce rationale prose paragraphs, output only the spec.`** Non-negotiable — unbounded direction-A in prior engagement hung 50 minutes.

Produces `design/04-direction-A.md`, `design/04-direction-B.md`, `design/04-direction-C.md`. Each direction includes:
1. Explicit anti-pattern declarations (5+ defaults rejected, INCLUDING the AI-editorial pattern)
2. WCAG AA contrast pairings
3. First-scroll information-density audit
4. Typography choice citing readability research
5. Concrete differentiation claim
6. Reviews treatment
7. Text-first contact positioning
8. Mobile composition spec separate from desktop
9. **Vibe alignment** — archetype the direction commits to + vibe-fit score (0-100) vs detected vibe + what's preserved / what's modernized / over-modernization risk for this archetype (per modernization-mapping skill)
10. **Motion** — character description + token values (durations, easings) + 3-6 patterns shipped + 3+ patterns explicitly rejected + reduced-motion behavior + mobile adaptations (per motion-design skill)

The three directions must NOT all map to disjoint archetypes — that's a brand-strategy menu, not modernization. Acceptable patterns per modernization-mapping skill: (a) three flavors of one archetype, (b) one archetype + blend variations, (c) two on-vibe + exactly one adjacent-archetype proposal with research justification.

Then dispatch UX agent for cross-review. Produces `design/05-ux-review-of-directions.md`. Each direction scored on 20 heuristics; WCAG check on every contrast pairing; emotional arc per direction; category-fit score (does this read as `{{INDUSTRY}}` or as "law firm/architect/AI-template"); **vibe-fit score** (does this preserve the detected archetype or has it over-modernized into a different one); **motion review** (do the patterns shipped match the spec, are anti-pattern motions absent, is reduced-motion handled).

**Direction selection (orchestrator decides; no stopping for Pat).** Read the UX cross-review's recommendation in `design/05-ux-review-of-directions.md`. The chosen direction is the one with the highest combined score across:
- 20-heuristic average ≥ 80
- Vibe-fit score ≥ 80 (per modernization-mapping skill)
- Zero CRITICAL findings
- Highest emotional-arc rating

Tiebreakers in order: (1) highest vibe-fit, (2) lowest motion-anti-pattern count, (3) UX agent's named recommendation. Document the choice in `design/06-direction-decision.md` with a "Pat may override at Phase 7" footer that names the runners-up + reasons each was not chosen, so the approval-handoff makes a redirect cheap.

Status update: brief one-paragraph summary of what was chosen and why, then proceed to Phase 3 immediately.

### Phase 3 — Tokenize + decompose (designer agent)

Dispatch designer with the Phase 3 packet using the orchestrator-chosen direction. Produces `design/07-tokens.md` (DESIGN.md format) + `design/08-task-decomp.md`.

If chosen direction's tokens fail WCAG AA contrast on any pairing, designer flags AND proposes the smallest viable alternative — orchestrator applies it. Do NOT stop for Pat; the alternative is documented in the approval packet so Pat can review the contrast resolution at Phase 7.

### Phase 4 — Build (Claude Code as implementer; per-component developer + ux gating)

Now Claude Code shifts into implementation mode. Build in dependency order:

1. `src/layouts/SiteLayout.astro` — palette tokens from `design/07-tokens.md`; per-client edits (palette, banner text, footer NAP, credentials block, service list, area list, favicon path)
2. `src/pages/index.astro` — homepage hero + services grid + reviews + footer; chosen direction's spec drives composition; 5-second test should identify the business as `{{INDUSTRY}}` not "law firm" or "AI template"
3. `src/pages/services/[slug].astro` — dynamic route via `getStaticPaths`; one entry per service; trust signals strip + 3-section content body + related-tag grid + cross-link to 3 other services
4. `src/pages/audit.astro` — fill with per-client values from research artifacts. Honor verified-vs-illustrative integrity rule.
5. `src/pages/proposal.astro` — fill with per-client name + intro paragraph (2 paragraphs) + client email in FAQ Q3. Universal: 9 deliverables, 3 tiers (locked pricing $1,495 / $1,995+$149 / $2,495+$399), 7 FAQ items, dual CTA.

After every page: dispatch developer agent (with code-review + architecture-review + security-review skills). Either agent can block. After homepage passes, dispatch UX agent for visual review on the deployed preview URL.

Patch-dispatch pattern: once direction is locked and scaffold exists, dispatches stop using agent gating and become single-shot fix prompts. If you can write the dispatch in 4 sentences, don't gate it. Pat is the QA gate at this point.

**Setup at start of Phase 4:** if this is a fresh machine without Node.js installed, run `bash scripts/bootstrap.sh` first — it installs Node via the OS package manager (dnf / apt / brew / winget), runs `npm install`, and fetches Chromium. Otherwise run `npm install` directly — the `postinstall` hook auto-fetches Chromium. Recovery for browser fetch failures: `npx playwright install chromium`.

Run `npm run build` after every page lands; fail fast on build errors. Quick smoke check: `npx playwright test --project=smoke` (uses the dev server automatically).

**Proposal page (locked deliverable):** the build is not complete without `src/pages/proposal.astro` filled with per-client values. The proposal is the document the prospect business owner sees — the single most conversion-critical artifact. It MUST include: 2-paragraph intro that explicitly references what was learned about THIS business (cite the dominant archetype from `research/current-site-vibe.md` and the differentiation claim from `research/competitive-teardown.md`); the 9 locked deliverables; the 3 locked tiers ($1,495 / $1,995+$149 / $2,495+$399); the 7 FAQ items with the client email in Q3; dual CTA (Calendly + Stripe). The intro paragraph is what makes the proposal feel custom — never a generic template intro. If you cannot cite the vibe extraction in the intro because Phase 0.5 didn't run, STOP — the proposal cannot ship without it.

### Phase 5 — Deploy

Run `npx vercel` to deploy preview. Capture preview URL.

If `npx vercel --prod` fails, use the alias-set workaround:
npx vercel alias set <preview-url> <production-host>

Disable Vercel Deployment Protection: project → Settings → Deployment Protection → Disabled. (You cannot toggle this from the CLI; flag it and tell Pat to do this once in the Vercel dashboard.)

### Phase 5.5 — Lesson candidate capture (passive, throughout the engagement)

As each agent dispatch returns, ask one quick question: "did this dispatch surface a course-correction worth saving for next engagement?" If yes, hold the candidate in a scratch list (do NOT append to lesson files mid-engagement — that pollutes context). Format each candidate the same way as the lesson files specify:

- Importance (CRITICAL / MAJOR / MINOR)
- Trigger (what happened)
- Rule (what to do differently)
- Why (evidence)
- Source (this client + date)

The exception: a CRITICAL course-correction that must NOT be repeated on the very next dispatch in this engagement may be appended immediately to the relevant `.lessons.md` file with an `[applied-mid-engagement]` tag — but this should be rare. Most candidates wait for Phase 7.

### Phase 6 — Pre-handoff QA + report

Dispatch QA agent with mode 1+2+3 (smoke + content + Lighthouse) on the production URL. Capture Lighthouse mobile + desktop scores. Test tap-to-call + tap-to-text on mobile viewport. Click every link across 3 tabs + service detail pages + 3 CTAs.

If any CRITICAL or 3+ MAJOR findings: re-dispatch as patch fix, re-deploy, re-test. Do NOT stop for Pat — fix and re-test up to 3 times per finding. After 3 attempts on the same finding, queue the finding for the approval packet with all 3 attempts documented (per BASE-AGENT.md §4 three-strike rule).

### Phase 6.5 — Self-assessment battery (orchestrator runs every check)

Before declaring done, the orchestrator runs the same checks Pat would run, captures evidence, and only proceeds to the approval handoff if every CRITICAL check passes. Run in this order:

1. **Build cleanly:** `npm run build` exits 0. Capture stdout/stderr to `qa/build-{timestamp}.log`.

2. **Routes:** every static route returns 200 on the production URL: `/`, `/audit`, `/proposal`, every `/services/{slug}`. Captured via `npx playwright test --project=smoke` against `PLAYWRIGHT_BASE_URL`.

3. **No unresolved tokens in build output:**
   ```
   grep -rE '\{\{[A-Z_]+\}\}' dist/      # must return zero matches
   grep -rE '\[CLIENT_TBD' dist/         # zero matches in shipped HTML
   grep -rE '\[VIBE_TBD' dist/           # zero matches
   ```
   If any match, mark CRITICAL `unresolved_token` finding. Replace with the value from research (rerun research dispatch if needed) OR queue as Pat-input for the approval packet.

4. **No fabricated content:** spot-check the audit page's "VERIFIED" claims against `research/seo-audit.md` + `research/current-content-inventory.md`. Spot-check the proposal intro against `research/current-site-vibe.md` + `research/competitive-teardown.md`. Spot-check homepage reviews against `research/reputation-harvest.md` (every review verbatim or omit). Any mismatch = CRITICAL.

5. **Lighthouse mobile + desktop ≥90 on all four** (Performance, Accessibility, Best Practices, SEO):
   ```
   URL=<production-url> npm run qa:lighthouse
   ```
   Below floor on any score → re-run optimization, fix, retry. Three failed attempts → queue for approval packet.

6. **WCAG AA via axe:**
   ```
   URL=<production-url> npm run qa:a11y
   ```
   Any violation = CRITICAL.

7. **Mobile-viewport interactions:**
   ```
   PLAYWRIGHT_BASE_URL=<production-url> npx playwright test --project=mobile --project=a11y
   ```
   Tap targets ≥44px, tel: link works, sticky nav visible.

8. **Vibe-fit verification:** UX agent (Mode B, rendered review) on the production URL. Required output: vibe-fit score for the rendered build vs `research/current-site-vibe.md`. Below 75 = MAJOR, queue for approval packet (this is recoverable by Pat picking a different direction).

9. **Proposal page intro check:** the 2 intro paragraphs must each cite at least one specific from research (archetype name, axis score, differentiation claim, or a near-verbatim phrase from the existing site/reviews). Generic boilerplate ("we help small businesses…") = CRITICAL. Re-draft using research-cited specifics.

10. **Stripe + Calendly placeholders:** the 3 Stripe links + Calendly URL in `src/data/pat-llc.ts` must be Pat's real values, not `{{...}}` placeholders. (For Pat LLC's master template, these are already wired — verify they didn't get reverted.)

11. **noindex meta:** `<meta name="robots" content="noindex" />` MUST be present on every prospect-facing page (Pat removes manually before launch).

Self-assessment confidence score (0-100): a weighted score where CRITICAL checks count 25 each (4 of them = 100 minus other deductions), MAJOR checks 10 each, MINOR 2 each. Below 80 = NOT_DONE; queue everything failing for the approval packet and stop. At or above 80 = DONE_PROVISIONAL; proceed to Phase 7.

### Phase 7 — Approval handoff (THE single approval gate)

This is the only place the orchestrator hands work to Pat for review. Produce a single artifact at `approval/{client-slug}-{YYYY-MM-DD}.md` with this structure:

```markdown
# Approval packet — {{CLIENT_NAME}}

**Verdict: DONE_PROVISIONAL | NOT_DONE_BECAUSE_X**
**Self-assessment confidence: {0-100}**
**Production URL:** <url>

## Quick check
A 6-bullet summary Pat can read in 60 seconds:
- Vibe extracted: <archetype + axis highlights>
- Direction chosen: <A | B | C> — <one-line rationale>
- Lighthouse mobile / desktop: <P / A / BP / SEO scores>
- Tap targets / a11y: <pass | fail>
- Reviews verbatim from harvest: <yes | no>
- Open questions for Pat: <count>

## What changed vs. the existing site
A 4-8 bullet list with concrete preserves and modernizations, citing the vibe-extraction + competitive-teardown artifacts.

## Direction-pick rationale
- Chosen: <A | B | C>
- Why: <citing UX cross-review scores + vibe-fit>
- Runners-up: <one-line per non-chosen direction with the reason it was not picked>
- **If Pat wants to redirect:** the engagement re-runs from Phase 3 with the new direction. Estimated effort: 30-50 minutes (Phase 3 dispatch + Phase 4 re-implementation + Phase 6.5 re-run).

## Self-assessment battery results
A copy of the Phase 6.5 results — every check listed PASS / FAIL / SKIPPED with evidence path.

## Open questions for Pat (single batch)
Numbered list of every [CLIENT_TBD] / `runtime_blocked` / unresolved-token surfaced during the engagement. Each entry includes:
- The question (e.g. "Owner's preferred contact mechanism for after-hours: call, text, or both?")
- The pages affected
- The default the orchestrator used in the meantime (e.g. "Defaulted to 'call only' on the homepage hero.")
- The remediation cost if Pat wants to change it (e.g. "single patch — 5 minutes.")

## Things Pat should specifically double-check
A pre-emptive checklist of judgment calls the orchestrator made that are reasonable but defensible-vs-reversible:
- [ ] Hero photo selection (which existing-site image was promoted)
- [ ] Service slug renames (any URL changes from old → new)
- [ ] Reviews shortlist (3 chosen for homepage; full set in research/)
- [ ] Direction pick (covered above)
- [ ] Any contrast resolution applied if WCAG AA initially failed
- [ ] Any service-area towns added/removed from footer
- [ ] Any [CLIENT_TBD] defaults applied

## Lessons added this engagement
A pointer to the retrospective at `retrospectives/{client-slug}-{date}.md` with a 3-line summary.

## Hard blockers (if NOT_DONE)
If verdict is NOT_DONE, list each blocker with:
- What was attempted (3 distinct approaches per BASE-AGENT.md §4)
- What went wrong each time
- What's needed from Pat to unblock

## How to redirect
If Pat reads this and wants any of these adjustments, paste the relevant directive back to me:
- "Re-pick direction B" → engagement re-runs from Phase 3
- "[Q1, Q3, Q5 answers]" → single patch dispatch fills the open questions
- "Revise [page] hero" → patch dispatch with specifics
- "Approve and ship" → Phase 8 retrospective + final report
```

After writing this packet, status update to Pat is exactly one message: "Approval packet ready at `approval/{...}.md`. Confidence {N}/100. Production URL: {url}. {open-questions count} open questions queued. Awaiting your review."

Then stop. Do not run Phase 8 retrospective until Pat responds with "approve" or revises.

### Phase 8 — Retrospective (after Pat approves at Phase 7)

Once the production URL is live and Pat has the final report, run the retrospective. This is the ONLY time you write to per-agent lesson files.

1. **Read all 7 lesson files**: `.claude/agents/researcher.lessons.md`, `designer.lessons.md`, `ux.lessons.md`, `qa.lessons.md`, `developer.lessons.md`, `product-owner.lessons.md`, `_orchestrator.lessons.md`.

2. **Reconcile your scratch list of lesson candidates** (held throughout Phase 5.5):
   - Drop candidates that duplicate an existing lesson.
   - Drop candidates that are already encoded in `BASE-AGENT.md` or the agent's role spec — those are standing orders, not lessons.
   - Promote the rest to lessons in their respective agent files. Newest at top.

3. **Review existing lessons in each file**:
   - Was this lesson load-bearing during this engagement (i.e. you almost made the mistake it warns against, or the agent applied the rule)? → keep, no change.
   - Has this lesson been superseded by a permanent rule change in `BASE-AGENT.md` or the role spec? → remove. Note in retrospective why.
   - Has this lesson been proven wrong or misleading by this engagement's evidence? → remove. Note in retrospective why.
   - Otherwise → keep. CRITICAL lessons are never pruned by importance; MINOR > MAJOR > CRITICAL pruning order applies only if a file genuinely becomes unreadable in length.

4. **Write the retrospective summary file** at `retrospectives/{client-slug}-{YYYY-MM-DD}.md`:
   - Lessons added (per agent) with rationale
   - Lessons removed (per agent) with rationale
   - Lessons kept (count only — no inventory)
   - Patterns surfaced for future `BASE-AGENT.md` or `KICKOFF_PROMPT.md` updates (these are recommendations to Pat, not auto-applied)
   - **Template propagation block** at the top: copy-paste-ready Markdown of every newly-added lesson, so Pat can paste it back into the template repo's lesson files when curating which lessons graduate from per-client to template-wide.

5. **If no lessons surfaced for any agent** — file an empty retrospective with "no lessons" noted. Do not invent lessons to fill the file. This is a valid outcome, especially as the system matures.

Status update to Pat: how many lessons added, removed, kept; whether any patterns suggest BASE-AGENT.md or KICKOFF_PROMPT.md edits.

---

Final report to Pat:
- Production URL
- Lighthouse scores summary
- Tabs + service pages confirmed live
- Demo banner working
- noindex meta in place (must be removed before launch)
- Stripe + Calendly URLs are placeholders (must be replaced before launch)
- Outstanding [needs Pat input] tokens flagged
- Pre-launch checklist attached

==================================================================
SECTION 4 — REPORTING PROTOCOL
==================================================================

After EACH phase completes, produce a brief status update (3-5 sentences):
- Phase name + what was produced
- Files created (paths only)
- Key findings or decisions made
- Any escalations needed

**Operating mode is autonomy — single approval gate at Phase 7.** Do NOT wait for Pat to respond between phases. The only conditions that justify stopping mid-engagement are these HARD blockers:

1. **Phase 0 read-verify failure** — missing agents / lesson files / skills / unfilled tokens / Node not installed. Recovery is operator action, not orchestrator action.
2. **Phase 5 deploy completely failing** — `vercel --prod` AND `vercel alias set` workaround both failed. Without a live URL, Phase 6.5 cannot run.
3. **Three-strike escalation hit on the same task** (per BASE-AGENT.md §4) — agent attempted 3 distinct approaches and all 3 failed. Surface the 3 attempts and stop.
4. **Phase 6.5 self-assessment confidence <80** — the orchestrator believes the work is not ready. File NOT_DONE in the approval packet at Phase 7 with explicit blockers; do not silently push through.

Everything else queues for the Phase 7 approval packet:
- Direction picks → orchestrator picks per Phase 2 rule, runner-ups documented for Pat redirect
- Would-be invention / [CLIENT_TBD] / unresolved facts → defaulted in build (with the default flagged), surfaced in approval packet's "Open questions for Pat" section
- CRITICAL agent findings → orchestrator attempts patch fix up to 3 times; if still failing, queues with documented attempts
- WCAG contrast failure → designer proposes alternative; orchestrator applies; documented for Pat to confirm
- Lighthouse below floor → orchestrator optimizes 3 attempts; if still failing, queued

For all phase transitions: status update (3-5 sentences) + proceed.

For all other phase transitions: status update + proceed.

==================================================================
SECTION 5 — DELIVERABLES (what counts as "done")
==================================================================

The engagement is COMPLETE when:

1. `research/` contains 9 files (1 from 0a + 1 from 0b + 5 from 0.5 + 2 from 0.6) — including `current-site-vibe.md`
2. `design/` contains 9 files (01-brief, 03-ia, 04-direction-A, 04-direction-B, 04-direction-C, 05-ux-review-of-directions, 06-direction-decision, 07-tokens, 08-task-decomp)
3. `src/pages/` contains: index.astro, services/[slug].astro, audit.astro, proposal.astro
4. `src/layouts/SiteLayout.astro` is per-client edited
5. Production URL is live at `https://{{client-slug}}.vercel.app` (or alias-set equivalent)
6. Demo banner + sticky tab nav present on all 3 prospect-facing pages + service detail pages
7. `<meta name="robots" content="noindex" />` is present (Pat removes at launch)
8. Lighthouse mobile ≥90 on all four categories
9. `approval/{client-slug}-{YYYY-MM-DD}.md` exists with verdict (DONE_PROVISIONAL or NOT_DONE_BECAUSE_X), self-assessment confidence ≥80, full battery results, open-questions list, and Pat-redirect instructions
10. Pat reviews the approval packet and either approves or requests revisions
11. `retrospectives/{client-slug}-{YYYY-MM-DD}.md` exists (after Pat approves) with lessons added/removed/kept summary + template-propagation block

==================================================================
SECTION 6 — FAILURE MODES + RECOVERIES
==================================================================

| Failure | Recovery |
|---|---|
| Researcher Phase 0a runs >30min or >25 sites | Abort; re-dispatch with `acceptance: max 12 sites, do not exceed 20` |
| Designer Phase 2 unbounded direction hangs | Re-dispatch with ≤12KB cap + `non_goals: spec only no rationale` |
| API termination mid-dispatch | Resume with explicit "continue from {{last-section}}" + size cap |
| `vercel --prod` fails | Use `vercel alias set <preview-url> <production-host>` |
| Deployment Protection blocks prospect view | Tell Pat to disable in Vercel dashboard |
| Yelp / BBB blocks scraping | Fall back to Google search snippets; ask client for Google Takeout export |
| Schema not detected on legacy site | Ship full LocalBusiness + Service + Review schema on the rebuild |
| Token unresolved in this prompt's input | STOP, tell Pat which token is unfilled |
| Three directions converge on similar aesthetic | Re-dispatch designer with explicit "DO NOT" anti-pattern declarations matching the convergent aesthetic |
| Chosen direction fails WCAG AA on key pairing | Designer proposes alternatives; Pat picks contrast resolution; do not re-pick direction |

==================================================================
SECTION 7 — CRITICAL ANTI-PATTERNS
==================================================================

1. Do NOT design. Claude Code is the orchestrator + implementer. The designer agent owns visual direction. Never produce hero copy, mockups, or aesthetic decisions outside the designer dispatches.
2. Do NOT skip phases. Implementation begins at Phase 4, not before.
3. Do NOT use the "AI editorial template." Warm cream + serif italic + § markers + grain overlays = REJECTED.
4. Do NOT fabricate ANYTHING — anywhere on the build, not just the audit page. This is the load-bearing principle of the engagement: scrape the existing site back-to-front, recreate it modern + tasteful, keep the real details accurate. If a fact (service description, owner bio, hours, license number, review text, photo subject, credential, certification, year-founded, employee count, service-area town, tagline) is not directly observable on the live site OR cited from a verifiable external source, mark it `[CLIENT_TBD]` and surface it as an open question to Pat. Never paraphrase reviews — verbatim or omit. Never AI-generate photos passed as real client work. Never synthesize a tagline that wasn't already in the source content. Never invent a service the client does not actually offer. The audit-page Verified-vs-Illustrative rule is one instance of this broader principle: only mark VERIFIED what was actually observed.
5. Do NOT promise 24/7 emergency framing unless the client genuinely operates 24/7.
6. Do NOT push to GitHub before Pat reviews.
7. Do NOT skip the size cap on Phase 2 designer dispatch. Single most likely failure mode.
8. Do NOT mark anything FIXED without runtime evidence. SIMULATED QA = FAIL.

==================================================================
SECTION 8 — START
==================================================================

Begin Phase 0 now. Read `PROJECT_BRIEF.md`. Read `.claude/agents/BASE-AGENT.md`. Verify the 7 tokens above are filled. Confirm agent + skill files are present. Then begin Phase 0a (competitive teardown).

Status update after Phase 0 verification, then proceed.
