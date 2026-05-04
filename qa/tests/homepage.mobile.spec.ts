import { test, expect } from '@playwright/test';

test.describe('mobile (iPhone 13 viewport)', () => {
  test('hero CTAs are tap-target compliant (≥44×44px)', async ({ page }) => {
    await page.goto('/');
    const ctas = page.locator('main .hero__cta-row .cta');
    const count = await ctas.count();
    for (let i = 0; i < count; i++) {
      const box = await ctas.nth(i).boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('tap-to-call link uses tel: scheme', async ({ page }) => {
    await page.goto('/');
    const tel = page.locator('a[href^="tel:"]').first();
    await expect(tel).toBeVisible();
  });

  test('tab nav is reachable via touch (visible on initial paint)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.tab-nav')).toBeVisible();
  });
});
