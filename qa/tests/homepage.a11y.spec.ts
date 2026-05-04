import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = ['/', '/audit', '/proposal'];

for (const path of pages) {
  test(`a11y on ${path} — no WCAG AA violations`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    if (results.violations.length > 0) {
      console.log(`Violations on ${path}:`);
      for (const v of results.violations) {
        console.log(`  - ${v.id} (${v.impact}): ${v.description}`);
        for (const node of v.nodes) {
          console.log(`      target: ${node.target.join(', ')}`);
        }
      }
    }

    expect(results.violations).toEqual([]);
  });
}
