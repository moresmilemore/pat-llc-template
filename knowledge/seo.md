---
topic: SEO — current state for service-trade verticals
refreshed: 2026-05-04
sources:
  - https://developers.google.com/search/docs
  - https://developers.google.com/search/docs/appearance/structured-data/local-business
  - https://web.dev/articles/vitals
  - https://moz.com/learn/seo (cross-reference only)
---

# SEO — current state (2026)

## Ranking factors that matter for service-trade local sites

In rough order of weight for "plumber/roofer/electrician + city" queries:

1. **Google Business Profile completeness + activity** — biggest single lever; verified address, hours, photos, recent reviews, posts. Site SEO supports this; GBP is primary.
2. **Page experience signals** (Core Web Vitals — see `web-perf.md`).
3. **Topical relevance** — H1, H2, body copy match query intent. Service pages must say the service.
4. **Local schema** — `LocalBusiness` + `Service` + `Review` JSON-LD. Boosts rich-result eligibility.
5. **NAP consistency** — Name, Address, Phone exact match across site, GBP, Yelp, BBB.
6. **Backlinks from local sources** — supplier directories, BBB, chamber of commerce, local press. (Out of Pat LLC scope but flag in handoff.)
7. **Mobile-first crawl** — Google indexes the mobile version primarily; desktop-only content invisible.
8. **HTTPS + clean URL structure** — table stakes.

_dated 2026-05-04_

## What's NOT a ranking factor (debunk in client conversations)

- Meta keywords (deprecated since 2009; some clients still ask)
- Word count above a minimum threshold ("longer is better" — false; relevant + complete wins)
- Bounce rate (Google has said repeatedly it doesn't use this)
- Time on site (same)
- Number of pages on the site (quality > quantity for small-business)
- Submitting to search engines (auto-discovered; sitemap submission helps but isn't a ranking factor)

## Schema patterns Pat LLC ships

Every Pat LLC build includes `LocalBusiness` JSON-LD on every page:

```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "{{CLIENT_NAME}}",
  "image": "<homepage hero or fleet photo>",
  "telephone": "{{CLIENT_PHONE_TEL}}",
  "email": "{{CLIENT_EMAIL}}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{{CLIENT_STREET}}",
    "addressLocality": "{{CLIENT_CITY}}",
    "addressRegion": "{{CLIENT_REGION}}",
    "postalCode": "{{CLIENT_POSTAL}}"
  },
  "url": "{{DEPLOYED_PROTOTYPE_URL}}",
  "openingHours": "{{CLIENT_HOURS}}",
  "areaServed": "{{SERVICE_AREA}}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{AVG_RATING}}",
    "reviewCount": "{{REVIEW_COUNT}}"
  }
}
```

For each service in `src/data/services.ts`, ship a `Service` schema block. For each review in the homepage reviews block, ship a `Review` schema (verbatim text only — never paraphrased).

## URL migration discipline

When rebuilding an existing client site, the orchestrator MUST preserve URL → URL mapping (researcher Phase 0.5 produces `research/url-migration-map.md`).

For every old URL that gets a new path:
- Configure 301 redirect in `vercel.json` (`{ "redirects": [{ "source": "/old", "destination": "/new", "permanent": true }] }`)
- 301 is permanent — passes link equity
- 302 is temporary — does NOT pass link equity. Use only for genuinely temporary redirects.

Drop URLs only when the old content is genuinely removed (not just renamed). Drop = 410 Gone (preferred over 404 if intentional).

## What's changed since training cutoffs

- **Helpful Content System** absorbed into core ranking (March 2024) — "people-first" content guidance still applies; no separate signal anymore. Practical impact: thin AI-generated boilerplate gets demoted faster.
- **AI Overviews / SGE** (now widely deployed) — appearing for ~25% of queries. Local service queries less affected. Schema markup increases citation eligibility.
- **E-E-A-T** still the framework Google evaluates by. For service trades, the "Experience" pillar is dominant: photos of actual work, owner identity verifiable, license numbers in footer, real reviews on real platforms.
- **Crawl budget** is no longer a concern for sites under ~10K pages. Pat LLC sites are 10–25 pages — crawl budget is irrelevant.
- **Mobile usability report** retired from Search Console (2023). Use Lighthouse + WCAG tooling for mobile checks.
- **AMP** is dead. Do not propose. Do not ship.

_dated 2026-05-04_

## Pat LLC SEO build checklist

Every shipped site:
- [ ] `LocalBusiness` schema on every page
- [ ] `Service` schema on each `/services/{slug}` page
- [ ] `Review` schema on homepage (one per featured review)
- [ ] `<title>` unique per page, ~60 char target
- [ ] `<meta name="description">` unique per page, ~155 char target
- [ ] `<meta property="og:*">` Open Graph for social shares
- [ ] `<link rel="canonical">` self-referential on every page
- [ ] `robots.txt` allowing all (except staging — `noindex` meta in template until launch)
- [ ] `sitemap.xml` auto-generated
- [ ] 301 redirects from every legacy URL via `vercel.json`
- [ ] Image alt text descriptive (reuses content for SEO + a11y)
- [ ] H1 contains the primary keyword for the page

## Tooling and verification

- **Google Search Console** — register the production domain after launch (Pat does this manually).
- **Schema validator**: https://validator.schema.org/ or https://search.google.com/test/rich-results
- **Lighthouse SEO category** ≥ 95 on every page
- **Local citation checker**: BrightLocal or Yext (manual; out of automated build scope)
