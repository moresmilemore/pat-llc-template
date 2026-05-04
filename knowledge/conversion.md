---
topic: conversion + UX research — current authoritative sources
refreshed: 2026-05-04
sources:
  - https://baymard.com/research
  - https://www.nngroup.com/articles/
  - https://cxl.com/blog/
  - https://web.dev/articles/
---

# Conversion research — current state (2026)

This file is a curated index of the research Pat LLC builds cite. The researcher (Phase 0b) extends this list per-engagement with vertical-specific sources; this is the durable backbone.

## The institutions that matter

| Source | What they cover | Reliability |
|---|---|---|
| **Baymard Institute** | E-commerce + checkout UX, eye-tracking, mobile UX | High; original studies, large samples |
| **Nielsen Norman Group** | General web UX heuristics, evergreen patterns | High; cite specific articles by date |
| **CXL Institute** | Conversion rate optimization, A/B testing | Medium-high; some vendor-aligned content |
| **web.dev** (Google) | Performance, Core Web Vitals, modern web platform | High for technical claims; vendor-published |
| **Smashing Magazine** | Practitioner-level patterns | Medium; cite specific authors |
| **WebAIM** | Accessibility | High; standards-aligned |

Lower-tier sources (use for triangulation, not standalone):
- HubSpot blog (vendor-biased)
- Neil Patel blog (low signal)
- Generic "10 tips" Medium posts (skip)

## Key findings Pat LLC builds rely on

### Trust signals + decision-making (service trade)

- **Reviews + ratings near the top of the page increase contact-form submissions** (multiple Baymard / NN/g studies, 2018–2024; verify per-engagement).
- **Photos of real people / real work outperform stock photography** by 30-60% on engagement metrics (Nielsen Norman, 2019, replicated 2022).
- **Phone numbers visible without clicking — particularly on mobile — reduce bounce on local-service queries** (Baymard 2021).
- **Click-to-call beats forms for service-trade local intent.** "Plumber near me" users want to call now, not fill a form (CXL, 2022).
- **Trust badges (BBB, Google rating, license number) carry weight when verifiable.** Fake or unverifiable badges erode trust (Nielsen Norman, 2020).

### Information density

- **Above-the-fold mobile (375×667) should communicate ≥3 specific things** for service-trade audiences (not 1 hero claim + scroll-to-discover): who you are, what you do, how to reach you.
- **Generic SaaS hero patterns (one big headline + one CTA, vast whitespace) underperform on service-trade verticals** — audience tolerates higher density.
- **Carousels test poorly across the board.** Static reveals beat auto-rotating banners on every metric except producer convenience.

### Mobile-first reality (2026)

- **Service-trade traffic: ~70-85% mobile** (varies by vertical; plumbing/HVAC higher, B2B services lower). Verify in research/conversion-evidence per engagement.
- **Mobile users scroll ~2-3× faster than desktop.** Information at "above-the-fold" on desktop may already be scrolled past on mobile.
- **Mobile tap accuracy: 96% accuracy at 44×44px targets, drops below 80% at 24×24px** (per multiple usability studies — WCAG 2.2 raised AA minimum to 24×24, but Pat LLC ships 44×44 because the use case is mobile-first).

### Forms and conversion

- **Every additional form field reduces completion ~5-10%.** Pat LLC default: name + phone + 1 free-text. No "How did you hear about us?" until after first contact.
- **Form below the fold on mobile is a known-bad pattern** — convert form-led pages to call-led with form as secondary.
- **Inline validation beats validation on submit** for completion rate.

_dated 2026-05-04_

## Sources researcher (Phase 0b) should default to

When the dispatch asks for "≥12 cited sources," the researcher cites a mix of:

- 3-4 from Baymard (vertical-relevant if available)
- 2-3 from Nielsen Norman
- 1-2 from CXL
- 2 from web.dev for performance claims
- 1-2 from WebAIM for accessibility
- 1-2 industry-vertical reports (e.g., Service Direct, Angi for trades; CallRail for call-tracking)

Citations include URL + retrieval date + source-tier (per `research-methodology` SKILL).

## Anti-cite list (do NOT use)

- Random "Top 10" listicles without methodology
- Vendor case studies with vague metrics ("increased conversions by Xx" without baseline / methodology)
- Statistics that get re-quoted without origin (track them back to the original study; if you can't, don't cite them)
- Anything from before 2018 unless it's a foundational principle (Hick's Law, Fitts' Law, Tesler's Law)

## What's changed since training cutoffs (mid-2024 onward)

- **AI search citations** — sites that rank in Google AI Overviews tend to be those with strong schema, clear authorship, and high E-E-A-T markers (consistent with Pat LLC build patterns).
- **Mobile-first checkout** — patterns from Baymard's 2024 mobile checkout study apply more broadly: the form pattern that wins on mobile checkout (single column, auto-advance, real keyboard types) wins on contact forms too.
- **Click-to-text beats click-to-call in some Gen Z verticals** — verify per client. For service trades with primarily 35+ audiences, call still wins.

_dated 2026-05-04_
