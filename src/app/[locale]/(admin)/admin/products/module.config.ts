export const ADMIN_PRODUCTS_MODULE_CONFIG = {
  queryKeys: {
    all: ['admin-products'] as const,
    list: (params?: Record<string, any>) => ['admin-products', 'list', params] as const,
    detail: (id: string) => ['admin-products', 'detail', id] as const,
    weightOptions: ['weight-options'] as const,
  },
  defaultPageSize: 10,
  endpoints: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    addImage: (id: string) => `/products/${id}/images`,
    deleteImage: (id: string, imgId: string) => `/products/${id}/images/${imgId}`,
    weightOptions: '/weight-options',
  },
} as const;
