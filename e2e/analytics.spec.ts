import { test, expect } from './fixtures/auth';

test.describe('Analytics Integration', () => {
  test('should fetch and render revenue data successfully', async ({ authedPage: page }) => {
    // Navigate to admin analytics dashboard
    await page.goto('/en/admin/dashboard');

    // Wait for the specific analytics module to load.
    // The revenue endpoint should be called successfully.
    const revenueRequest = page.waitForResponse(response =>
      response.url().includes('/api/v1/analytics/sales') && response.status() === 200
    );

    await Promise.all([
      revenueRequest,
    ]);

    // Verify UI reflects data, use getByRole or getByText
    // Assuming there's a chart or a metric card for revenue
    await expect(page.getByText('Revenue', { exact: false })).toBeVisible();

    // Check that ghost component state (loading infinitely or error) is resolved
    await expect(page.getByRole('alert')).not.toBeVisible();
  });

  test('should fetch and render top products successfully', async ({ authedPage: page }) => {
    await page.goto('/en/admin/dashboard');

    const topProductsRequest = page.waitForResponse(response =>
      response.url().includes('/api/v1/analytics/top-products') && response.status() === 200
    );

    await Promise.all([
      topProductsRequest,
    ]);

    // Verify UI
    await expect(page.getByText('Top Products', { exact: false })).toBeVisible();
  });
});
