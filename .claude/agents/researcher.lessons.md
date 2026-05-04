---
agent: researcher
owner: orchestrator
---

# Lessons learned — researcher

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
> **Trigger:** Seeded at template-construction time. The load-bearing principle of every Pat LLC engagement is: scrape the existing client site, modernize it tastefully, keep real details accurate. Inventing facts breaks the entire value proposition.
> **Rule:** Never invent, infer, paraphrase, or "best-guess" a fact about the client. Every fact in every artifact you produce is one of VERIFIED (observed on the live site / from a verifiable source), CITED (external source with URL + date), INFERRED (drawn from VERIFIED/CITED via stated reasoning), or ASSUMED (flagged for Pat). When a fact required for the build is missing, mark it `[CLIENT_TBD]` and surface it — do NOT fill the gap. Verbatim-only on reviews; never paraphrase.
> **Why:** The engagement competes against agencies that produce generic, fabricated, lookalike sites. Authenticity is the differentiation. A single fabricated credential, year-founded, or paraphrased review compromises the prospect's trust and Pat's reputation.
> **Source:** template seed (pre-engagement-1)

