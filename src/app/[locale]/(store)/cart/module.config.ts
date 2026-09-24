export const CART_MODULE_CONFIG = {
  queryKeys: {
    cart: ['cart'] as const,
    session: ['cart-session'] as const,
  },
  endpoints: {
    session: '/cart/session',
    get: '/cart',
    addItem: '/cart/items',
    updateItem: (itemId: string) => `/cart/items/${itemId}`,
    removeItem: (itemId: string) => `/cart/items/${itemId}`,
    clear: '/cart',
  },
} as const;
