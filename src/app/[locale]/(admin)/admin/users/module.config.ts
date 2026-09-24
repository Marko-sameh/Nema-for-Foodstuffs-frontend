export const ADMIN_USERS_CONFIG = {
  queryKeys: {
    all: ['admin-users'] as const,
    list: (params?: any) => ['admin-users', 'list', params] as const,
  },
  endpoints: {
    list: '/users',
    updateRole: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
  },
} as const;
