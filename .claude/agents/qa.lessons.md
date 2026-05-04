---
agent: qa
owner: orchestrator
---

# Lessons learned — qa

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

> **L-001 · 2026-05-04 · MAJOR**
> **Trigger:** Seeded at template-construction time. The template ships with Playwright + Lighthouse + axe-core pre-installed and pre-configured (specs in `qa/tests/`, npm scripts wired). Agents that don't know this re-invent ad-hoc shell commands or report `runtime_blocked` when the tooling is right there.
> **Rule:** Before reporting `runtime_blocked: <tool>`, verify whether the tool is already installed via `package.json` and whether a wired npm script exists (`npm run qa:lighthouse`, `npm run qa:a11y`, `npx playwright test --project=smoke|mobile|a11y`). If the postinstall hook failed to install the Playwright browser, the recovery is `npx playwright install chromium`, not blocking. Existing test specs at `qa/tests/*.spec.ts` are the starting point — extend them, do not write new ones from scratch.
> **Why:** Reinvented commands inevitably miss configuration (baseURL, viewport, axe tags) and produce findings of dubious quality. Wired tooling produces consistent, comparable runs across engagements.
> **Source:** template seed (pre-engagement-1)

