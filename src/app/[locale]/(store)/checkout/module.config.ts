export const CHECKOUT_MODULE_CONFIG = {
  queryKeys: {
    addresses: ['addresses'] as const,
  },
  endpoints: {
    createOrder: '/orders',
    applyCoupon: '/coupons/validate',
  },
} as const;
