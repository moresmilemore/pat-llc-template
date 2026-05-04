# Project brief — {{CLIENT_NAME}}

Fill this in during the per-client intake (kit §4–§6). The Ultra-Prompt cross-checks
§1 facts against the 7 tokens you paste at kickoff. Mark unknown values `[CLIENT_TBD]`
and resolve at proposal stage rather than fabricating.

---

## 1. Verified client facts

- **Business name:** {{CLIENT_NAME}}
- **Owner / primary contact:** {{OWNER_NAME}}
- **Industry:** {{INDUSTRY}}
- **Phone:** {{CLIENT_PHONE}} (preferred mechanism: {{CALL_OR_TEXT_OR_BOTH}})
- **Email:** {{CLIENT_EMAIL}}
- **Address:** {{CLIENT_STREET}}, {{CLIENT_CITY}}, {{CLIENT_REGION}} {{CLIENT_POSTAL}}
- **Hours:** {{CLIENT_HOURS}}
- **Service area:** {{SERVICE_AREA}}
- **Production URL:** {{CLIENT_URL}}
- **In-progress redesign URL (if any):** [CLIENT_TBD]
- **License / credential numbers:** {{CLIENT_LICENSE}}
- **Insurance / bonding:** {{CLIENT_INSURANCE}}
- **Social profiles:**
  - Facebook: [CLIENT_TBD]
  - Instagram: [CLIENT_TBD]
  - LinkedIn: [CLIENT_TBD]

## 2. Reputation

- **Google Business Profile URL:** {{GOOGLE_BUSINESS_PROFILE_URL}}
- **Other review platforms:** [CLIENT_TBD]
- **Review count + average:** {{REVIEW_COUNT_TARGET}}+ reviews target — actual count to be filled by researcher Phase 0.6

## 3. Visitor types

Most contractor sites have two; ecommerce or B2B may differ. Edit per client.

### Primary visitor: planned-purchase
- Searches with intent ("plumber near me", "{service} {city}")
- Compares 2–4 sites before contacting
- Mobile-first
- Decides on: trust signals, reviews, clarity of service offered, contact mechanism

### Secondary visitor: same-day-business-hours
- Already has a problem ("water leaking now")
- Wants a phone number prominent + tap-to-call
- Less concerned with reviews, more concerned with availability
- Decides on: speed of response, willingness to come out today

## 3.5 Vibe / archetype (filled by researcher Phase 0.5)

The vibe-extraction skill produces `research/current-site-vibe.md` with the dominant archetype, axis scores, and preserve/modernize/reject lists. Mirror the dominant archetype here for quick reference during design — actual axis scores live in the research artifact:

- **Dominant archetype:** [CLIENT_TBD — one of: warm-trad / polished-pro / neighborhood / engineered / boutique / civic]
- **Blend (if any):** [CLIENT_TBD]
- **Vibe-fit gate for direction proposals:** all three Phase 2 directions must score ≥75 vibe-fit unless the operator explicitly authorizes an adjacent-archetype proposal

## 4. Anti-goals

What this site must NOT look like:

1. [CLIENT_TBD — name a competitor or pattern they explicitly want to differentiate from]
2. Generic SaaS ("We're more than X, we're Y" tagline)
3. The "AI editorial template" (warm cream + serif italic + § markers + grain overlays — anti-pattern lock-list)
4. Stock photography of smiling people in hard hats
5. Carousel testimonials

## 5. Differentiators (preserve verbatim if found in existing site)

- {{DIFFERENTIATOR_1}}
- {{DIFFERENTIATOR_2}}
- {{DIFFERENTIATOR_3}}

Source authentic copy from `research/current-site-strengths.md` after Phase 0.5.

## 6. IA seed

Routes the build will produce:

- `/` — homepage
- `/audit` — site audit (template skeleton in repo)
- `/proposal` — proposal (template skeleton in repo)
- `/services/{slug}` — one per service identified in research

### Service slug seeds (Phase 0.5 may revise)
- {{SERVICE_1_SLUG}} — {{SERVICE_1_NAME}}
- {{SERVICE_2_SLUG}} — {{SERVICE_2_NAME}}
- {{SERVICE_3_SLUG}} — {{SERVICE_3_NAME}}

### Towns / cities served (for footer + per-area schema where appropriate)
- {{TOWN_1}}
- {{TOWN_2}}
- {{TOWN_3}}

## 7. Content + assets

- **Photos available:** [CLIENT_TBD] (count, type, can client provide more?)
- **Pricing transparency posture:** [CLIENT_TBD] (publish ranges? fixed prices? quote-only?)
- **Booking system:** [CLIENT_TBD]
- **Mobile vs. desktop split (if known):** [CLIENT_TBD]

## 8. Quality bar

Locked, not per-client:
- LCP < 2.0s mobile
- CLS < 0.05
- INP < 150ms
- First-load < 500KB
- Lighthouse mobile ≥90 across all four categories
- WCAG AA on every text/background pairing
- Touch targets ≥44×44px on mobile
- All copy reading-level appropriate (≤8th grade for service-trade audiences)

## 9. Out of scope

- E-commerce / cart / payment (other than Stripe deposit links on proposal)
- Member portals / auth
- Custom backends
- Multi-language

## 10. Notes from intake

[CLIENT_TBD — anything else surfaced during the intake form. Append here.]
