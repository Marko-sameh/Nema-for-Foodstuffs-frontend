import { useQuery } from '@tanstack/react-query';
import { CATEGORIES_MODULE_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { PaginatedResponse } from '@/types/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
}

export function useCategoriesList() {
  return useQuery({
    queryKey: CATEGORIES_MODULE_CONFIG.queryKeys.list(),
    queryFn: async () => {
      return api.get<PaginatedResponse<Category>>(CATEGORIES_MODULE_CONFIG.endpoints.list);
    },
  });
}

export function useCategoryDetail(slug: string) {
  return useQuery({
    queryKey: CATEGORIES_MODULE_CONFIG.queryKeys.detail(slug),
    queryFn: async () => {
      const response = await api.get<{ data: Category; message: string; success: boolean }>(
        CATEGORIES_MODULE_CONFIG.endpoints.detail(slug)
      );
      return response;
    },
    enabled: !!slug,
  });
}
