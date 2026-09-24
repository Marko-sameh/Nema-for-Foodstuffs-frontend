export const SEARCH_MODULE_CONFIG = {
  queryKeys: {
    search: (query: string) => ['search', query] as const,
  },
  endpoints: {
    search: '/search',
  },
  debounceMs: 400,
} as const;
