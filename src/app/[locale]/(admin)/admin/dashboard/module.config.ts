export const ADMIN_DASHBOARD_CONFIG = {
  queryKeys: {
    stats: ['admin-dashboard', 'stats'] as const,
    recentOrders: ['admin-dashboard', 'recent-orders'] as const,
  },
  endpoints: {
    stats: '/analytics/overview',
    recentOrders: '/orders/admin/all?limit=5',
  },
} as const;
