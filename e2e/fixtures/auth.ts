import { test as base, expect, type Page } from '@playwright/test';

/**
 * Extends Playwright's base test with an `authedPage` fixture that reuses a
 * storageState captured after logging in, so authenticated specs don't need
 * to repeat the login flow.
 */
export const test = base.extend<{ authedPage: Page }>({
  authedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: 'e2e/.auth/user.json' });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect };
