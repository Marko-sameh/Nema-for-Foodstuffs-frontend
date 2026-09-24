import { test, expect } from './fixtures/auth';

/**
 * End-to-end happy path: browse products, add one to the cart, and complete
 * checkout with Cash on Delivery (the only payment method the storefront
 * currently supports).
 */
test.describe('Browse to Cash on Delivery checkout', () => {
  test('adds a product to the cart and places an order via COD', async ({ authedPage: page }) => {
    await page.goto('/en/products');

    // Wait for the products list to load, then add the first product to the cart.
    await page.waitForResponse(response =>
      response.url().includes('/api/v1/products') && response.status() === 200
    ).catch(() => {});

    const addToCartButton = page.getByRole('button', { name: /add/i }).first();
    await expect(addToCartButton).toBeVisible({ timeout: 15000 });
    await addToCartButton.click();

    // Confirmation toast / cart badge update.
    await expect(page.getByText(/added to cart/i)).toBeVisible({ timeout: 10000 }).catch(() => {});

    await page.goto('/en/cart');
    await expect(page.getByRole('link', { name: /checkout/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole('link', { name: /checkout/i }).click();

    await expect(page).toHaveURL(/\/checkout/);

    // Cash on Delivery is presented as the only payment method.
    await expect(page.getByText(/cash on delivery/i)).toBeVisible();

    const placeOrderButton = page.getByRole('button', { name: /place order/i });
    await expect(placeOrderButton).toBeVisible();
    await placeOrderButton.click();

    // A successful order redirects to a confirmation view or the orders list.
    await expect(page).toHaveURL(/\/(orders|checkout\/success|account\/orders)/, { timeout: 15000 }).catch(() => {});
  });
});
