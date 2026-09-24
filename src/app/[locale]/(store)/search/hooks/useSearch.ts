import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { SEARCH_MODULE_CONFIG } from '../module.config';
import { SearchFilters, SearchResult } from '../types/search.types';

export function useSearch(filters: SearchFilters) {
  return useQuery({
    queryKey: SEARCH_MODULE_CONFIG.queryKeys.search(JSON.stringify(filters)),
    queryFn: () => api.get<SearchResult>(SEARCH_MODULE_CONFIG.endpoints.search, filters),
    enabled: !!filters.query && filters.query.length >= 2,
    staleTime: 0,
  });
}
