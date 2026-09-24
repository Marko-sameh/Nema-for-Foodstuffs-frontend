export const ADMIN_ORDERS_CONFIG = {
  queryKeys: {
    all: ['admin-orders'] as const,
    list: (params?: any) => ['admin-orders', 'list', params] as const,
    detail: (id: string) => ['admin-orders', 'detail', id] as const,
  },
  endpoints: {
    list: '/orders/admin/all',
    detail: (id: string) => `/orders/admin/${id}`,
    updateStatus: (id: string) => `/orders/admin/${id}/status`,
  },
} as const;
