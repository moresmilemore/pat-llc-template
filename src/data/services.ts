// Per-client services list. Phase 4 fills this from research/competitive-teardown.md
// and the existing client site's content inventory.
//
// Each entry generates a static page at /services/{slug} via src/pages/services/[slug].astro.

export interface Service {
  slug: string;
  name: string;
  shortDescription: string;
  body: string;             // longer-form copy, preserved verbatim from existing site where possible
  related: string[];        // slugs of 3 related services (cross-link grid)
}

export const services: Service[] = [
  {
    slug: 'service-one',
    name: '{{SERVICE_1_NAME}}',
    shortDescription: '{{SERVICE_1_SHORT}}',
    body: '{{SERVICE_1_BODY}}',
    related: ['service-two', 'service-three', 'service-four'],
  },
  {
    slug: 'service-two',
    name: '{{SERVICE_2_NAME}}',
    shortDescription: '{{SERVICE_2_SHORT}}',
    body: '{{SERVICE_2_BODY}}',
    related: ['service-one', 'service-three', 'service-four'],
  },
  {
    slug: 'service-three',
    name: '{{SERVICE_3_NAME}}',
    shortDescription: '{{SERVICE_3_SHORT}}',
    body: '{{SERVICE_3_BODY}}',
    related: ['service-one', 'service-two', 'service-four'],
  },
  // Phase 4: extend with all services from research/current-content-inventory.md.
  // Typical service-trade business has 3–10 services.
];
