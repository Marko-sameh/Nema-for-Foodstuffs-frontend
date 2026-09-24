export const PROFILE_MODULE_CONFIG = {
  queryKeys: {
    profile: ['profile'] as const,
  },
  endpoints: {
    get: '/users/me',
    update: '/users/me',
    changePassword: '/users/me/password',
  },
} as const;
