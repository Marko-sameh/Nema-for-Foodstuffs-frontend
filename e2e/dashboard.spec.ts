import { test, expect } from './fixtures/auth';

test.describe('Admin Dashboard Integration', () => {
  test('should fetch and render overview stats and recent orders successfully', async ({ authedPage: page }) => {
    await page.goto('/en/admin/dashboard');

    const statsRequest = page.waitForResponse(response =>
      response.url().includes('/api/v1/analytics/overview') && response.status() === 200
    );

    const ordersRequest = page.waitForResponse(response =>
      response.url().includes('/api/v1/orders/admin/all') && response.status() === 200
    );

    await Promise.all([
      statsRequest,
      ordersRequest,
    ]);

    await expect(page.getByText('Dashboard', { exact: false })).toBeVisible();
    await expect(page.getByRole('alert')).not.toBeVisible();
  });
});
