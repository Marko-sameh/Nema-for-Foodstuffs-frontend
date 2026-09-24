import { useQuery } from '@tanstack/react-query';
import { ProductsAPI } from '../domain/product.api';
import { PRODUCTS_MODULE_CONFIG } from '../module.config';
import { ProductFilters } from '../types/product.types';

/**
 * Fetch paginated product list.
 * NOTE: staleTime MUST be 0 — this is a filter-driven query.
 * Passing staleTime > 0 will cause stale filter data to be served on reset.
 */
export function useProductsList(params?: {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: PRODUCTS_MODULE_CONFIG.queryKeys.list(params),
    queryFn: () => ProductsAPI.fetchAll(params),
    staleTime: 0,
  });
}

/**
 * Fetch a single product by its URL slug.
 */
export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: PRODUCTS_MODULE_CONFIG.queryKeys.detail(slug),
    queryFn: () => ProductsAPI.fetchBySlug(slug),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });
}
