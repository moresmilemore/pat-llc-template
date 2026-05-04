// Component-level smoke specs. Targets the /dev/components showcase route
// where every production component renders with sample data.

import { test, expect } from '@playwright/test';

test.describe('component showcase (/dev/components)', () => {
  test('returns 200 and renders showcase intro', async ({ page }) => {
    const response = await page.goto('/dev/components');
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1').first()).toBeVisible();
  });

  test('Hero renders with split + centered variants', async ({ page }) => {
    await page.goto('/dev/components');
    const heroes = page.locator('.hero');
    expect(await heroes.count()).toBeGreaterThanOrEqual(2);
  });

  test('TrustStrip renders signals', async ({ page }) => {
    await page.goto('/dev/components');
    await expect(page.locator('.trust-strip').first()).toBeVisible();
  });

  test('ServiceGrid renders cards', async ({ page }) => {
    await page.goto('/dev/components');
    const cards = page.locator('.service-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(3);
  });

  test('ReviewsBlock renders 3 review tiles', async ({ page }) => {
    await page.goto('/dev/components');
    const tiles = page.locator('.review-tile');
    expect(await tiles.count()).toBe(3);
  });

  test('FaqList accordion expands on click', async ({ page }) => {
    await page.goto('/dev/components');
    const firstFaq = page.locator('.faq__item').first();
    await firstFaq.locator('.faq__q').click();
    await expect(firstFaq).toHaveAttribute('open', '');
  });

  test('AuditFindingCard renders all 3 severities', async ({ page }) => {
    await page.goto('/dev/components');
    await expect(page.locator('[data-severity="critical"]')).toBeVisible();
    await expect(page.locator('[data-severity="moderate"]')).toBeVisible();
    await expect(page.locator('[data-severity="minor"]')).toBeVisible();
  });

  test('ComparisonTable renders rows', async ({ page }) => {
    await page.goto('/dev/components');
    await expect(page.locator('.comparison table')).toBeVisible();
    const rows = page.locator('.comparison tbody tr');
    expect(await rows.count()).toBeGreaterThanOrEqual(3);
  });

  test('ContactForm renders required fields', async ({ page }) => {
    await page.goto('/dev/components');
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
    await expect(page.locator('.contact-form__submit')).toBeVisible();
  });

  test('LocalBusiness JSON-LD ships on every prospect page', async ({ page }) => {
    for (const path of ['/', '/audit', '/proposal', '/services/service-one']) {
      await page.goto(path);
      const ldBlocks = await page.locator('script[type="application/ld+json"]').count();
      expect(ldBlocks, `${path} should ship at least 1 JSON-LD block`).toBeGreaterThan(0);
    }
  });
});
