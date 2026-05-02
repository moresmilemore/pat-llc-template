// Pat LLC constants. Substituted once during one-time setup; not edited per client.
// Replace placeholders with your real Stripe payment links + Calendly handle before
// any prospect sees the proposal page.

export const patLlc = {
  brand: {
    name: 'Pat LLC',
    tagline: 'AI-built sites for small businesses, finished by hand.',
    email: 'pat@patllc.com',
    phone: '(XXX) XXX-XXXX',
  },
  links: {
    calendlyIntro: 'https://calendly.com/pat-llc/intro',
    stripeTierA: 'https://buy.stripe.com/REPLACE_TIER_A',
    stripeTierB: 'https://buy.stripe.com/REPLACE_TIER_B_DEPOSIT',
    stripeTierC: 'https://buy.stripe.com/REPLACE_TIER_C_DEPOSIT',
  },
  comparison: {
    typicalAgencyAnnualFloor: 3600,
  },
} as const;

export type PatLlcConstants = typeof patLlc;
