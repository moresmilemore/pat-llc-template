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
    stripeTierA: 'https://buy.stripe.com/14AbJ1fSM2G1gON1mkbwk00',
    stripeTierB: 'https://buy.stripe.com/6oUeVd8qk5SddCBc0Ybwk01',
    stripeTierC: 'https://buy.stripe.com/bJe14ncGAcgB4214ywbwk02',
  },
  comparison: {
    typicalAgencyAnnualFloor: 3600,
  },
} as const;

export type PatLlcConstants = typeof patLlc;
