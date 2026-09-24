export const ORDERS_MODULE_CONFIG = {
  queryKeys: {
    all: ['customer-orders'] as const,
    list: () => ['customer-orders', 'list'] as const,
    detail: (id: string) => ['customer-orders', 'detail', id] as const,
  },
  endpoints: {
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
  },
} as const;
