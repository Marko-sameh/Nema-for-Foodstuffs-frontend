import { test, expect } from '@playwright/test';

/**
 * Verifies the /ar locale renders right-to-left with Arabic copy.
 * Unauthenticated: any visitor should get correct localization.
 */
test.describe('Arabic locale rendering', () => {
  test('renders /ar with dir="rtl" and Arabic copy', async ({ page }) => {
    await page.goto('/ar');

    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // Arabic search placeholder / nav copy from src/messages/ar/common.json.
    await expect(page.getByText('المنتجات', { exact: false }).first()).toBeVisible();
  });
});
