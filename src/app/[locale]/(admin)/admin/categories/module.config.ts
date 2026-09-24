export const ADMIN_CATEGORIES_CONFIG = {
  queryKeys: {
    all: ['admin-categories'] as const,
    list: () => ['admin-categories', 'list'] as const,
  },
  endpoints: {
    list: '/categories',
    create: '/categories',
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
} as const;
