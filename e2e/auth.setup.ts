import { test as setup } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

// Run once before the authenticated suites to log in and persist storageState.
setup('authenticate', async ({ page }) => {
  const email = process.env.E2E_TEST_EMAIL ?? 'test@example.com';
  const password = process.env.E2E_TEST_PASSWORD ?? 'password123';

  await page.goto('/en/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole('button', { name: /login|sign in/i }).click();
  await page.waitForURL(/\/(en|ar)\/?$/, { timeout: 10000 }).catch(() => {});

  await page.context().storageState({ path: authFile });
});
