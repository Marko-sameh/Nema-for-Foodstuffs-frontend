import { test, expect } from './fixtures/auth';

test.describe('Admin Categories Integration', () => {
  test('should fetch and render categories successfully', async ({ authedPage: page }) => {
    await page.goto('/en/admin/categories');

    const categoriesRequest = page.waitForResponse(response =>
      response.url().includes('/api/v1/categories') && response.status() === 200
    );

    await Promise.all([
      categoriesRequest,
    ]);

    await expect(page.getByText('Categories', { exact: false })).toBeVisible();
    await expect(page.getByRole('alert')).not.toBeVisible();
  });
});
