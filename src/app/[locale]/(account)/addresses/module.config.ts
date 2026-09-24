export const ADDRESSES_MODULE_CONFIG = {
  queryKeys: {
    all: ['addresses'] as const,
    list: () => ['addresses', 'list'] as const,
  },
  endpoints: {
    list: '/addresses',
    create: '/addresses',
    update: (id: string) => `/addresses/${id}`,
    delete: (id: string) => `/addresses/${id}`,
  },
} as const;
