export const ADMIN_ANALYTICS_CONFIG = {
  queryKeys: {
    revenue: ['admin-analytics', 'revenue'] as const,
    topProducts: ['admin-analytics', 'top-products'] as const,
  },
  endpoints: {
    revenue: '/analytics/sales',
    topProducts: '/analytics/top-products',
  },
} as const;
