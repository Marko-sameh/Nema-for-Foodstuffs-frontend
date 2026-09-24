export const CATEGORIES_MODULE_CONFIG = {
  queryKeys: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
    detail: (slug: string) => ['categories', 'detail', slug] as const,
  },
  endpoints: {
    list: '/categories',
    detail: (slug: string) => `/categories/${slug}`,
  },
} as const;
