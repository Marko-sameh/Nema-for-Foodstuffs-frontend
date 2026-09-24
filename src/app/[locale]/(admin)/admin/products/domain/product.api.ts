import { api } from '@/lib/api';
import { Product } from '@/types/product';
import { ADMIN_PRODUCTS_MODULE_CONFIG } from '../module.config';
import { AdminProductFormValues } from '../validation/product.schema';
import { AdminProductListParams, AdminProductListResponse } from '../types/admin-product.types';

/**
 * WidthsAPI-style class: centralises all admin product HTTP calls.
 * Endpoint strings come from module.config.ts — no magic strings in hooks/components.
 */
export class AdminProductsAPI {
  static async fetchAll(params?: AdminProductListParams): Promise<AdminProductListResponse> {
    return api.get<AdminProductListResponse>(ADMIN_PRODUCTS_MODULE_CONFIG.endpoints.list, params);
  }

  static async fetchById(id: string): Promise<Product> {
    return api.get<Product>(ADMIN_PRODUCTS_MODULE_CONFIG.endpoints.detail(id));
  }

  static async create(payload: AdminProductFormValues): Promise<Product> {
    return api.post<Product>(ADMIN_PRODUCTS_MODULE_CONFIG.endpoints.create, payload);
  }

  static async update(id: string, payload: Partial<AdminProductFormValues>): Promise<Product> {
    return api.patch<Product>(ADMIN_PRODUCTS_MODULE_CONFIG.endpoints.update(id), payload);
  }

  /** Returns 400 with { used_in: [...] } when product is referenced — handled by hook. */
  static async delete(ids: string[]): Promise<void> {
    return api.delete(ADMIN_PRODUCTS_MODULE_CONFIG.endpoints.delete(ids[0]), { data: { ids } });
  }
}
