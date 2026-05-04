---
agent: ux
owner: orchestrator
---

# Lessons learned — ux

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
> **Trigger:** Seeded at template-construction time. Direction proposals can technically pass the 20-heuristic review but still ship a polished site that doesn't read as the client's actual business — the failure mode is over-modernization (warm-trad business shipped as boutique premium, polished-pro shipped as engineered B2B).
> **Rule:** On Mode A (direction cross-review), score every direction for **vibe-fit** against `research/current-site-vibe.md` — using the archetype + axis scores. A direction with vibe-fit <75 is CHANGES_REQUESTED regardless of heuristic scores. On Mode B (rendered review), run a 5-second test: would a regular customer of this business recognize the rebuilt site as their familiar place, just modernized? If no, file a CRITICAL "vibe drift" finding.
> **Why:** The engagement's value is modernizing the existing business, not branding it as something new. A boutique-premium output for a warm-traditional client looks impressive in isolation but fails the prospect-conversion test — the owner won't show it off because it isn't them.
> **Source:** template seed (pre-engagement-1)

> **L-002 · 2026-05-04 · MAJOR**
> **Trigger:** Seeded at template-construction time. Motion is the easiest place for a "polished" build to leak anti-patterns — auto-rotating carousels, parallax beyond budget, decorative loops, scroll-jacking, bouncy easing.
> **Rule:** On every rendered review, audit motion against `motion-design` SKILL anti-pattern list. Run the page in DevTools with FPS meter on; any animation costing more than 16ms/frame is a MAJOR finding. Verify `prefers-reduced-motion` actually disables decorative motion (test by toggling in DevTools). Verify `transition: all` does not appear in the shipped CSS (grep the build output).
> **Why:** Smooth and smart motion is the difference between a modern site and a fashion-modern site. Anti-pattern motion makes the site feel cheap or aggressive even when typography and color are right.
> **Source:** template seed (pre-engagement-1)

