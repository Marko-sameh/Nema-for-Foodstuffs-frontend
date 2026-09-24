import { test, expect } from './fixtures/auth';

test.describe('Admin Users Integration', () => {
  test('should fetch and render users list successfully', async ({ authedPage: page }) => {
    await page.goto('/en/admin/users');

    const usersRequest = page.waitForResponse(response =>
      response.url().includes('/api/v1/users') && response.status() === 200
    );

    await Promise.all([
      usersRequest,
    ]);

    await expect(page.getByText('Users', { exact: false })).toBeVisible();
    await expect(page.getByRole('alert')).not.toBeVisible();
  });
});
