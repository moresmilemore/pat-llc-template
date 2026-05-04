import { test, expect } from '@playwright/test';

test.describe('homepage smoke', () => {
  test('returns 200 and renders hero', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('main h1').first()).toBeVisible();
  });

  test('demo banner is present', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.demo-banner')).toBeVisible();
  });

  test('sticky tab nav has three tabs', async ({ page }) => {
    await page.goto('/');
    const tabs = page.locator('.tab-nav nav .tab');
    await expect(tabs).toHaveCount(3);
  });

  test('footer renders with NAP', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.site-footer')).toBeVisible();
    await expect(page.locator('.site-footer a[href^="tel:"]').first()).toBeVisible();
    await expect(page.locator('.site-footer a[href^="mailto:"]').first()).toBeVisible();
  });

  test('audit and proposal pages return 200', async ({ page }) => {
    const audit = await page.goto('/audit');
    expect(audit?.status()).toBe(200);
    const proposal = await page.goto('/proposal');
    expect(proposal?.status()).toBe(200);
  });

  test('noindex meta is present (must be removed before launch)', async ({ page }) => {
    await page.goto('/');
    const robots = await page.locator('meta[name="robots"]').getAttribute('content');
    expect(robots).toContain('noindex');
  });
});
