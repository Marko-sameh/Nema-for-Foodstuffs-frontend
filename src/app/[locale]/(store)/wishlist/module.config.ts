export const WISHLIST_MODULE_CONFIG = {
  queryKeys: {
    wishlist: ['wishlist'] as const,
  },
  endpoints: {
    list: '/wishlist',
    add: '/wishlist',
    remove: (productId: string) => `/wishlist/${productId}`,
  },
} as const;
