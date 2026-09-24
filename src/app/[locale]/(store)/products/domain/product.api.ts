import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { PRODUCTS_MODULE_CONFIG } from '../module.config';
import { ProductFilters, ProductListResponse } from '../types/product.types';

export class ProductsAPI {
  /**
   * Fetch paginated product list with optional filters.
   * staleTime must be 0 on any hook consuming this — filter-driven query.
   */
  static async fetchAll(params?: {
    filters?: ProductFilters;
    page?: number;
    limit?: number;
  }): Promise<ProductListResponse> {
    const queryParams = {
      ...params?.filters,
      page: params?.page ?? 1,
      limit: params?.limit ?? PRODUCTS_MODULE_CONFIG.defaultPageSize,
    };
    return api.get<ProductListResponse>(PRODUCTS_MODULE_CONFIG.endpoints.list, queryParams);
  }

  /** Fetch a single product by URL slug (public endpoint). */
  static async fetchBySlug(slug: string): Promise<Product> {
    return api.get<Product>(PRODUCTS_MODULE_CONFIG.endpoints.detail(slug));
  }
}
