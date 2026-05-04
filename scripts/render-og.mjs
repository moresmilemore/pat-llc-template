// Render the SVG OG image to PNG using the already-installed Playwright Chromium.
// LinkedIn + some older social crawlers prefer PNG over SVG; this gives bulletproof
// social-share rendering without adding a sharp/canvas dep.
//
// Usage:
//   node scripts/render-og.mjs                              # renders public/og-default.svg → public/og-default.png
//   IN=public/foo.svg OUT=public/foo.png node scripts/render-og.mjs
//
// Output: 1200×630 PNG (canonical OG dimensions per Open Graph spec).

import { chromium } from 'playwright';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const IN = process.env.IN || 'public/og-default.svg';
const OUT = process.env.OUT || 'public/og-default.png';

if (!existsSync(IN)) {
  console.error(`[render-og] input not found: ${IN}`);
  process.exit(2);
}

const svg = readFileSync(IN, 'utf8');
const dims = svg.match(/viewBox=["'][\d.\s-]+\s+(\d+)\s+(\d+)["']/);
const width = dims ? parseInt(dims[1], 10) : 1200;
const height = dims ? parseInt(dims[2], 10) : 630;

const browser = await chromium.launch({ args: ['--no-sandbox'] });
const ctx = await browser.newContext({
  viewport: { width, height },
  deviceScaleFactor: 1,
});
const page = await ctx.newPage();

const html = `<!doctype html><html><head><style>
  html, body { margin: 0; padding: 0; background: transparent; }
  body { width: ${width}px; height: ${height}px; }
  svg { display: block; width: 100%; height: 100%; }
</style></head><body>${svg}</body></html>`;

await page.setContent(html);
await page.locator('svg').waitFor({ state: 'visible' });

await page.screenshot({
  path: OUT,
  type: 'png',
  fullPage: false,
  clip: { x: 0, y: 0, width, height },
});

await browser.close();

console.log(`[render-og] ${IN} → ${OUT} (${width}×${height})`);
