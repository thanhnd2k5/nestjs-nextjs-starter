import { test, expect } from '@playwright/test';

test.describe('core', () => {
  test('home page loads with app info', async ({ page }) => {
    await page.goto('/vi');

    await expect(page.getByRole('heading', { name: 'nextjs-starter' })).toBeVisible();
    await expect(page.getByText('Frontend base')).toBeVisible();
  });

  test('locale switch via URL', async ({ page }) => {
    await page.goto('/en');
    await expect(page.getByText('Frontend base with optional auth')).toBeVisible();
  });
});
