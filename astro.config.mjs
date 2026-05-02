import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://example.vercel.app',
  integrations: [
    icon({
      include: {
        lucide: ['*']
      }
    })
  ],
  build: {
    inlineStylesheets: 'auto'
  }
});
