export const PRODUCTS_MODULE_CONFIG = {
  queryKeys: {
    all: ['products'] as const,
    list: (params?: Record<string, any>) => ['products', 'list', params] as const,
    detail: (slug: string) => ['products', 'detail', slug] as const,
  },
  defaultPageSize: 12,
  endpoints: {
    list: '/products',
    detail: (slug: string) => `/products/${slug}`,
  },
} as const;
