---
name: ux-review
description: The 20-heuristic UX evaluation framework with severity definitions and verdict rules. Loaded by ux agent and (for self-check) by designer agent.
---

# UX review framework

## The 20 heuristics

Run in this order on every review.

### H-1: First-time-visitor simulation
Open the page cold. Mark wall-clock time. At 3s: what do you understand? At 5s: what does the business do? At 10s: what's the next action? If you can't answer "what does this business do" in 5 seconds, that's a CRITICAL finding regardless of what else is on the page.

### H0: Literal text reading
Read every visible word out loud. Catch:
- Typos
- Wrong client name (e.g. "Ascme Plumbing" when it should be "Acme")
- Placeholder copy (lorem ipsum, "Replace this text")
- Unresolved tokens (`{{CLIENT_NAME}}`, `{{TBD}}`)
- Inconsistent capitalization (e.g. "Sam's Plumbing" in nav, "SAM'S PLUMBING" in footer)
- Sentence fragments that read as broken
- Phone numbers in inconsistent formats across the page

### H1-H10: Nielsen's classic heuristics

| # | Heuristic | What to check |
|---|---|---|
| H1 | Visibility of system status | Loading states, form submission feedback, navigation current-state indicator |
| H2 | Match between system and real world | Industry vocabulary (a plumber says "drain cleaning", not "wastewater management") |
| H3 | User control and freedom | Browser back works, escape from modals, no surprise redirects |
| H4 | Consistency and standards | Within-page (button styles), cross-page (header, footer), platform conventions |
| H5 | Error prevention | Form validation before submit, confirm before destructive actions |
| H6 | Recognition over recall | Visible labels on forms, persistent navigation, breadcrumbs where deep |
| H7 | Flexibility and efficiency | Keyboard shortcuts, tab order, paste-friendly inputs, autofill enabled |
| H8 | Aesthetic and minimalist design | Every element earns its space; no decoration without function |
| H9 | Help users recover from errors | Clear error copy, recovery path, no dead-ends |
| H10 | Help and documentation | FAQ exists where load-bearing, tooltips where novel |

### H11-H18: Craft-specific heuristics

| # | Heuristic | What to check |
|---|---|---|
| H11 | Emotional progression | Does scroll feel earned, building toward CTA? Or does the page deflate? |
| H12 | Mobile parity | Mobile matches desktop's information AND emotional arc, not a stripped subset |
| H13 | Touch targets | ≥44×44px on mobile for every tap target |
| H14 | Label appropriateness | CTAs labeled by what happens ("Schedule a call", not "Click here") |
| H15 | First-time clarity | A brand-new visitor can take action in 5 seconds |
| H16 | Premium feel | Typography, spacing, motion read as crafted, not templated |
| H17 | AI transparency | No fabricated reviews, no fake testimonials, no AI photos passed as real |
| H18 | Cognitive accessibility | Reading level appropriate (service-trade audiences ≤8th grade), short sentences, plain language |

## WCAG standing gate

On every review, also check:

- **Contrast**: every text-on-background pairing meets WCAG AA (4.5:1 normal, 3:1 large/bold ≥18px or ≥14px bold)
- **Font size**: body text ≥16px
- **Touch targets**: ≥44×44px on mobile
- **Alt text**: every img has alt (decorative images get `alt=""`, content images get descriptive alt)
- **Form labels**: every input has an associated label (not placeholder-only)
- **Heading order**: no h1→h3 skip
- **Keyboard reachability**: every interactive element reachable via tab
- **Focus indicators**: visible on every interactive element
- **ARIA landmarks**: nav, main, footer, complementary present and labeled

Any WCAG AA failure is CRITICAL.

## Severity definitions

- **CRITICAL** — blocks deploy. WCAG failure, broken link, fabricated content, page-break, illegible text, missing/wrong client info.
- **MAJOR** — degrades trust or conversion. Below-fold mobile CTA, missing reviews, weak hero, info-density mismatch.
- **MINOR** — polish. Spacing tweaks, copy tightening, secondary contrast meeting AA but not AAA.

## Verdict rules

- Any CRITICAL → BLOCKED
- 3+ MAJOR → CHANGES_REQUESTED
- Confidence <80 with non-zero MAJOR → CHANGES_REQUESTED
- Otherwise → APPROVED

## Output

Use the BASE-AGENT.md §6 review format. Every finding labeled CRITICAL/MAJOR/MINOR + VERIFIED/CITED/INFERRED.
