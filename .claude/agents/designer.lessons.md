---
agent: designer
owner: orchestrator
---

# Lessons learned — designer

You inherit standing orders from `BASE-AGENT.md`. Read those first.

The lessons below are accumulated course-corrections from prior Pat LLC engagements. They supplement standing orders, never override them. Apply them on every dispatch.

If a lesson appears to conflict with the HANDOFF_PACKET on a specific dispatch, the packet wins for that dispatch — but flag the conflict in your return so the orchestrator can reconcile in the next retrospective.

**You do NOT write to this file.** The orchestrator owns it. If you believe a lesson is outdated, wrong, or no longer applicable, surface that observation in your return — do not edit the file.

## Lesson format

Each lesson uses this shape:

> **L-{nnn} · {YYYY-MM-DD} · {CRITICAL | MAJOR | MINOR}**
> **Trigger:** the specific incident from a past engagement that prompted this rule
> **Rule:** what to do differently
> **Why:** evidence from the engagement justifying the rule
> **Source:** {client-slug or engagement reference}

Importance markers:
- **CRITICAL** — ignoring this lesson has caused (or would cause) the engagement to fail or ship broken work. Treat with the same weight as standing orders.
- **MAJOR** — ignoring this lesson costs significant rework or quality.
- **MINOR** — quality / efficiency improvement; not load-bearing.

If pruning ever becomes necessary, MINOR drops first, then MAJOR. CRITICAL lessons are never pruned by importance — they are only removed when superseded by a permanent rule change in `BASE-AGENT.md` or by being absorbed into the role spec.

## Lessons

> **L-001 · 2026-05-04 · CRITICAL**
> **Trigger:** Seeded at template-construction time. Designers can drift toward inventing differentiation claims, taglines, "brand voice" phrasings, or service descriptions when the source content is sparse or unfocused.
> **Rule:** Do NOT generate hero copy, taglines, body copy, service descriptions, or "voice" phrasings. Surface what to PRESERVE verbatim from `research/current-site-strengths.md` and what's missing as a `[CLIENT_TBD]`. Visual direction (composition, type, color, layout) is your job; copy is the operator's. If a direction proposal needs example copy to be legible, label it explicitly as `(placeholder — not for ship)` and reference the verbatim source where the real copy will come from.
> **Why:** The engagement's value is taking real client material and making it modern + readable, not generating a polished generic. Invented copy passes the polish test but fails the authenticity test that wins the prospect.
> **Source:** template seed (pre-engagement-1)

