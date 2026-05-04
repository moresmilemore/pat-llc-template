---
agent: _orchestrator
owner: orchestrator (self)
---

# Lessons learned — orchestrator

This file holds lessons that improve YOUR own behavior as the orchestrator (Claude Code running `KICKOFF_PROMPT.md`) across engagements: when to dispatch, how to brief, when to gate, when to skip, what failure modes to anticipate, what reporting cadence works, when to interrupt vs proceed.

Distinct from per-agent lesson files: those are about agent behavior; this one is about orchestration behavior.

## When to read

Read this file at Phase 0 of every engagement, immediately after `BASE-AGENT.md` and before issuing any dispatches. Apply the lessons throughout the run.

## When to write

You may write to this file. Append candidate lessons during the Phase 7 retrospective only — do not interleave writes during the engagement (it pollutes context and breaks flow). The exception: a CRITICAL lesson that must NOT be repeated on the very next dispatch may be appended immediately with a `[applied-mid-engagement]` tag.

You may NOT write to per-agent lesson files outside the Phase 7 retrospective step. Those are owned by you but disciplined to a single batched write at end-of-engagement.

## Lesson format

> **L-{nnn} · {YYYY-MM-DD} · {CRITICAL | MAJOR | MINOR}**
> **Trigger:** the specific incident from a past engagement that prompted this rule
> **Rule:** what to do differently
> **Why:** evidence from the engagement justifying the rule
> **Source:** {client-slug or engagement reference}

Importance markers:
- **CRITICAL** — ignoring this lesson has caused (or would cause) the engagement to fail or ship broken work. Treat with the same weight as standing orders.
- **MAJOR** — ignoring this lesson costs significant rework or quality.
- **MINOR** — quality / efficiency improvement; not load-bearing.

If pruning ever becomes necessary, MINOR drops first, then MAJOR. CRITICAL lessons are never pruned by importance — they are only removed when superseded by a permanent rule change in `KICKOFF_PROMPT.md` or `BASE-AGENT.md`.

## Lessons

> **L-004 · 2026-05-04 · CRITICAL**
> **Trigger:** Seeded at template-construction time. Pat's operating model is full autonomy with one approval gate at Phase 7. The temptation to stop mid-engagement and ask for confirmation ("which direction?", "should I default this?", "the contrast failed, what now?") undermines the whole reason for autonomy — Pat wants to walk away and check work once, not babysit every phase.
> **Rule:** Stop ONLY for the four hard blockers in Section 4 (Phase 0 verify failure / deploy completely failed / three-strike escalation / Phase 6.5 confidence <80). Everything else — direction picks, [CLIENT_TBD], CRITICAL findings, contrast resolutions, Lighthouse misses — gets resolved by the orchestrator (with up to 3 fix attempts) or queues for the Phase 7 approval packet. Do NOT degrade autonomy by re-introducing mid-engagement gates. Three failed attempts on the same task → stop only IF the failure blocks Phase 6.5 from running; otherwise queue and continue.
> **Why:** Mid-engagement gates were the prior failure mode — Pat got pulled in 5-7 times per build, eroding the value of the system. The Phase 7 approval packet is engineered to make redirects cheap (Pat picks B → re-run from Phase 3), so there's no quality cost to deferring decisions to the gate.
> **Source:** template seed (pre-engagement-1)

> **L-005 · 2026-05-04 · CRITICAL**
> **Trigger:** Seeded at template-construction time. Phase 6.5 (self-assessment battery) is what makes autonomy safe — without it, the orchestrator hands Pat broken work and calls it done. The temptation under deadline pressure is to skip checks, mark them PASS optimistically, or run them simulated.
> **Rule:** Every check in Phase 6.5 must run with runtime evidence — the Playwright spec must actually execute, Lighthouse must produce a JSON, axe must produce a JSON, the grep commands must run against `dist/`. SIMULATED self-assessment = FAIL (per BASE-AGENT.md §3). If a check is genuinely not runnable in the current environment (no production URL yet, no network), report `runtime_blocked: <reason>` and queue for Pat — do not pass-by-default.
> **Why:** Pat's review at Phase 7 trusts the self-assessment. If the orchestrator marks PASS without running, Pat reviews work that has unknown defects, finds them, and the trust budget collapses. One simulated PASS that Pat catches is worth 10 honest FAILs that the orchestrator queued.
> **Source:** template seed (pre-engagement-1)

> **L-006 · 2026-05-04 · MAJOR**
> **Trigger:** Seeded at template-construction time. Web standards drift fast — INP replaced FID in 2024, WCAG 2.2 superseded 2.1 in 2023, Astro 4 → 5 had real breaking changes, Helpful Content System merged into core ranking. Agents that work from training-data residue produce subtly outdated work.
> **Rule:** Phase 0 includes `npm run knowledge:check`. If any `knowledge/*.md` file is older than 30 days, refresh it before dispatching researcher. The dispatch packet for researcher always lists the relevant knowledge files in `inputs:`. When an agent surfaces a "the knowledge file disagrees with my training data" observation in its return, trust the knowledge file and queue any verification work for the retrospective — do not relitigate during the engagement.
> **Why:** Pat's competitive edge is shipping current work, not 2024 work with new colors. The knowledge base is what keeps the system from drifting silently as model training data ages.
> **Source:** template seed (pre-engagement-1)

> **L-002 · 2026-05-04 · CRITICAL**
> **Trigger:** Seeded at template-construction time. The proposal page (`src/pages/proposal.astro`) is the document the business owner reads when deciding to hire Pat. A generic, template-y proposal intro reads as "they didn't actually look at us" and kills conversion regardless of how good the site preview is.
> **Rule:** On Phase 4, the proposal page intro paragraphs (2 paragraphs) MUST cite specifics from this engagement — the dominant archetype from `research/current-site-vibe.md`, the differentiation claim from `research/competitive-teardown.md`, and a verbatim or near-verbatim phrase that appears on the existing site or in reviews. If you find yourself drafting "We help small businesses with…" generic boilerplate, STOP — that's invention by another name. Pull from research.
> **Why:** The proposal is the highest-leverage 200 words of the engagement. Treat it with the same anti-invention rigor as audit metrics.
> **Source:** template seed (pre-engagement-1)

> **L-003 · 2026-05-04 · MAJOR**
> **Trigger:** Seeded at template-construction time. The vibe extraction (Phase 0.5's 5th file) is load-bearing for Phase 1 brief and Phase 2 directions. Skipping it because the agent ran long, or because the result feels obvious, leaves the designer guessing.
> **Rule:** Phase 1 dispatch MUST include `research/current-site-vibe.md` in the inputs list. If the file is missing or has confidence <70, re-dispatch researcher for a follow-up before Phase 1, not after. The vibe-fit gate at UX cross-review depends on this artifact existing — do not let the engagement reach Phase 2 without it.
> **Why:** Without a structured vibe artifact, three Phase 2 directions tend to converge on whatever's aesthetically safe (which is usually adjacent to the AI editorial template anti-pattern). A documented archetype anchors the directions to the actual business.
> **Source:** template seed (pre-engagement-1)

> **L-001 · 2026-05-04 · CRITICAL**
> **Trigger:** Seeded at template-construction time. As orchestrator + Phase 4 implementer you are the most likely point in the pipeline to invent. When research artifacts lack a fact (a tagline, a service description detail, a review that fits a slot, a town name, an "established YYYY"), the path of least resistance is to fill it from common sense — that is the failure mode.
> **Rule:** When you encounter a missing fact during build, STOP and choose one of:
> (a) Re-dispatch researcher with a narrowly-scoped Phase 0.5/0.6 follow-up to find the fact on the live site,
> (b) Mark the artifact `[CLIENT_TBD]` and add it to the open-questions list surfaced to Pat,
> (c) Omit the section entirely if it isn't load-bearing.
> Do NOT pick option (d) "draft something plausible." Do NOT use placeholder copy without a `[CLIENT_TBD]` token visible in the build. The "would-be invention" is now a Section 4 reporting gate — pause and ask Pat.
> **Why:** Every fabricated fact in a Pat LLC build undermines the engagement's core value proposition (authentic modernization vs. generic AI lookalike). Recovery from a fabrication caught at QA or by Pat is more expensive than the small interruption of asking up-front.
> **Source:** template seed (pre-engagement-1)

