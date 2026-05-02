---
name: security-review
description: OWASP Top 10:2025 evaluation with exploit-path requirement and >80% confidence rule for CRITICAL filings. Pass 2 of the developer agent's three-skill review.
---

# Security review (OWASP Top 10:2025)

Run after architecture-review (Pass 1). Run before code-review (Pass 3).

## The categories

| # | Category | Common checks for this stack |
|---|---|---|
| A01 | Broken Access Control | Are admin routes (if any) actually protected? Are static `/admin*` routes accidentally exposed? |
| A02 | Cryptographic Failures | HTTPS-only? Cookies `Secure` + `HttpOnly` + `SameSite`? Secrets in env, not in code? |
| A03 | Injection (incl. XSS) | Are user inputs (form fields, URL params) sanitized before render? Astro auto-escapes `{var}` but `set:html` is a footgun. |
| A04 | Insecure Design | Forms without spam protection (Turnstile)? Rate limits on `/api/*`? |
| A05 | Security Misconfiguration | CSP headers set? CORS too permissive? Source maps deployed to production? |
| A06 | Vulnerable + Outdated Components | `npm audit` clean? Astro/dependency major versions current? |
| A07 | Identification + Authentication Failures | (Usually N/A for Pat LLC sites — service-trade brochureware. Flag if auth introduced.) |
| A08 | Software + Data Integrity Failures | Supply chain — are new deps from npm registry, not random tarballs? Lockfile committed? Subresource integrity on CDN scripts? **NEW emphasis 2025** |
| A09 | Security Logging + Monitoring Failures | Are auth events / form submissions logged? Are errors captured (Vercel logs, Sentry)? |
| A10 | Server-Side Request Forgery | Are server-side fetches limited to allowlisted hosts? |
| 2025+ | Mishandling Exceptional Conditions | Error pages leak stack traces? `try/catch` swallowing real errors? **NEW emphasis 2025** |

## Pat LLC stack-specific high-priority checks

Most security findings on this stack cluster around:

1. **Form endpoints** (`src/pages/api/contact.ts` or similar) — must include Turnstile verification, rate limiting, input validation, no raw error response to client.
2. **Env var leaks** — `import.meta.env.PUBLIC_*` is client-side; everything else is server-only. Never reference `STRIPE_SECRET_KEY` from a `.astro` file.
3. **`set:html` usage** — only on trusted markdown/MDX rendered at build, never on runtime data.
4. **Schema markup** — JSON-LD must come from trusted sources (PROJECT_BRIEF.md verified facts only, no user input).
5. **Stripe / Calendly URLs** — must be exact links Pat created, not constructed from URL params.

## Exploit-path requirement

Every security finding describes:
- **Who** attacks (anonymous, logged-in user, abuser, scraper, automated bot)
- **How** they attack (specific input + endpoint + technique)
- **What** they gain (data, credentials, defacement, denial of service)

If you cannot fill in all three, the finding is INCOMPLETE — don't file as CRITICAL. File as MAJOR with stated uncertainty.

## Confidence threshold

Per BASE-AGENT.md §2 + the >80% rule:
- CRITICAL findings require ≥80% confidence in the exploit path. Below that, downgrade to MAJOR.
- Speculative findings ("an attacker might be able to…" without a specific path) are MAJOR with `LOW_CONFIDENCE` flag.

## Anti-rationalization

If you find yourself thinking "this is fine because the orchestrator will…" — file the finding anyway. Trust the review process; let the orchestrator decide whether to fix or accept the risk explicitly.

## What does NOT belong in this review

- Code style (that's code-review)
- Performance (that's code-review)
- Architecture decisions (that's architecture-review, run before this pass)
- Brand/UX critique (that's UX agent)
