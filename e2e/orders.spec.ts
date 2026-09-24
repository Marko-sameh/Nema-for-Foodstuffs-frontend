import { test, expect } from './fixtures/auth';

test.describe('Orders Integration', () => {
  test('should fetch and render order list successfully', async ({ authedPage: page }) => {
    // Navigate to user account orders
    await page.goto('/en/account/orders');

    // Wait for the specific orders list module to load.
    // The list endpoint should be called successfully.
    const ordersListRequest = page.waitForResponse(response =>
      response.url().includes('/api/v1/orders') && response.status() === 200
    );

    await Promise.all([
      ordersListRequest,
    ]);

    // Verify UI reflects data, use getByRole or getByText
    await expect(page.getByText('Your Orders', { exact: false })).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible(); // Assuming orders are in a table
  });

  test('should fetch and render order detail successfully', async ({ authedPage: page }) => {
    // Navigate to a specific order detail page
    const testOrderId = '12345';
    await page.goto(`/en/account/orders/${testOrderId}`);

    const orderDetailRequest = page.waitForResponse(response =>
      response.url().includes(`/api/v1/orders/${testOrderId}`) && response.status() === 200
    );

    await Promise.all([
      orderDetailRequest,
    ]);

    // Verify UI
    await expect(page.getByText(`Order #${testOrderId}`, { exact: false })).toBeVisible();
  });
});
