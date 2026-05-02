---
name: research-methodology
description: Five-layer research depth protocol with severity classification, source hierarchy, durability test, and standardized output schema. Loaded by the researcher agent on every dispatch.
---

# Research methodology

## Five-layer research depth

Every research dispatch operates at one or more of these depths. The HANDOFF_PACKET acceptance criteria implicitly defines the floor.

**Layer 1 — Surface scan.** Read the home page, services pages, contact page of the target. Time-box: 5 minutes. Output: bullet list of observed facts.

**Layer 2 — IA + content inventory.** Crawl every reachable route. Capture H1/H2 per page, every form, every CTA, every internal link. Time-box: 20-30 minutes. Output: structured inventory artifact.

**Layer 3 — Evidence scrape.** Extract verbatim copy worth preserving (hero, owner bio, service descriptions, real testimonials), reviews from external platforms, schema/meta from page source. Time-box: 30-60 minutes. Output: verbatim content vault + reputation harvest.

**Layer 4 — Comparative analysis.** Run Layer 1-2 against 5-12 competitors. Identify patterns and outliers. Time-box: 60-90 minutes. Output: competitive teardown with shortlist.

**Layer 5 — Citation-grounded research.** Pull external sources (peer-reviewed, industry reports, vendor docs) on conversion patterns, eye-tracking, info density, contact-mechanism effectiveness. Minimum 12 cited sources. Time-box: 60-90 minutes. Output: conversion-evidence artifact.

## Severity classification

Apply to every action-implying finding:

| Severity | Meaning | Example |
|---|---|---|
| CRITICAL | Blocks deployment / endangers client | Site claims license number that doesn't match state registry |
| BREAKING | Known-bad pattern that costs conversion | Contact form below the fold on mobile |
| COMPELLING | Strong evidence to take action | "Click-to-text wins by 23% in this vertical" |
| ENRICHMENT | Supporting context, no direct action | Industry uses navy + gold palette historically |
| VOLATILE | True now, may not be in 6 months | Currently ranks #3 for keyword X |

## Source hierarchy

When sources conflict, resolve by tier (highest wins):

1. **Peer-reviewed research** — academic papers, controlled studies
2. **Vendor changelog / official docs** — for technical claims (Astro changelog, Vercel docs, Stripe docs)
3. **Standards body docs** — W3C, WCAG, Google webmaster guidelines
4. **Vendor-published case studies** — useful for benchmarks but biased toward vendor
5. **Industry reports** — Nielsen Norman, Baymard Institute, CXL Institute
6. **Expert practitioner posts** — named experts with verifiable track records
7. **Third-party blog aggregations** — useful for triangulation, weakest standalone

Mark every source with its tier in citations.

## Durability test

For every fact, ask: "Will this be true in 6 months?"

- YES → DURABLE finding. Use freely in design/build decisions.
- NO → VOLATILE finding. Timestamp the observation. Flag for re-check at engagement renewal.
- DEPENDS → INFERRED finding. State the dependency.

## Verbatim discipline (reviews)

Reviews are quoted verbatim or omitted. Never:
- Paraphrase to "improve grammar"
- Stitch fragments from multiple reviews into a synthetic quote
- Translate without flagging "translated from {language}"
- Truncate without `[…]` indicating elision

Attribution required: reviewer name (or first name + last initial if platform anonymizes), date, platform.

## Output schema

Every research artifact starts with this header block:

```yaml
---
phase: <0a | 0b | 0.5 | 0.6>
dispatched: <ISO8601>
client: <client-slug>
sources_count: <integer>
verified_count: <integer>          # facts directly observed via tool call
cited_count: <integer>             # facts backed by external source
inferred_count: <integer>          # facts drawn from VERIFIED + reasoning
volatile_count: <integer>          # facts marked VOLATILE
---
```

Body is markdown. Every fact-claiming sentence ends with a label: [VERIFIED], [CITED], [INFERRED], [ASSUMED], [VOLATILE], or [DURABLE]. Citations link inline.

End every artifact with a "What this enables" section listing 2-4 downstream decisions this evidence informs.
