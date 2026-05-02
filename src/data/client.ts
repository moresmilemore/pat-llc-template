// Per-client values. Edit during Phase 4 of the engagement.
// Every field below is an explicit token — leaving any unfilled is a CONTENT mode QA failure.

export const client = {
  // Identity
  name: '{{CLIENT_NAME}}',
  slug: '{{CLIENT_SLUG}}',
  industry: '{{INDUSTRY}}',

  // Contact
  phone: '{{CLIENT_PHONE}}',
  phoneTel: '{{CLIENT_PHONE_TEL}}',         // tel: format, e.g. "+15555550123"
  phoneText: '{{CLIENT_PHONE_TEXT}}',       // sms: format
  email: '{{CLIENT_EMAIL}}',

  // Address (optional)
  address: {
    street: '{{CLIENT_STREET}}',
    city: '{{CLIENT_CITY}}',
    region: '{{CLIENT_REGION}}',
    postalCode: '{{CLIENT_POSTAL}}',
  },

  // Operating
  hours: '{{CLIENT_HOURS}}',                // e.g. "Mon–Fri 8am–5pm" or "By appointment"
  serviceArea: '{{SERVICE_AREA}}',          // e.g. "Greater Springfield, IL"

  // Credentials
  licenseNumber: '{{CLIENT_LICENSE}}',
  insurance: '{{CLIENT_INSURANCE}}',

  // Web
  liveUrl: '{{CLIENT_URL}}',                // existing production site

  // Reputation (filled from research/reputation-harvest.md)
  reviewCount: 0,
  averageRating: 0,
  reviewSourceUrl: '{{GOOGLE_BUSINESS_PROFILE_URL}}',

  // Deployment
  deployedUrl: '{{DEPLOYED_PROTOTYPE_URL}}',
} as const;

export type Client = typeof client;
