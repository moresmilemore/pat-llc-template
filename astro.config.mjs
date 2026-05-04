import { defineConfig } from 'astro/config';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// `site` is used by canonical URLs + sitemap. Override per-client via the
// SITE_URL env var or by editing this file in Phase 4. For local dev, the
// dev server overrides this with localhost so canonicals work.
const site = process.env.SITE_URL || 'https://example.vercel.app';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  // Hybrid: pages are static by default; routes with `export const prerender = false`
  // become serverless functions on Vercel (used by /api/contact).
  output: 'static',
  adapter: vercel(),
  integrations: [
    icon({
      include: {
        lucide: ['*']
      }
    }),
    sitemap({
      // Sitemap auto-generates from all static routes. Excludes API routes.
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssCodeSplit: true
    }
  }
});
