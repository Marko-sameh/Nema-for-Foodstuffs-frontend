import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminProductsAPI } from '../domain/product.api';
import { ADMIN_PRODUCTS_MODULE_CONFIG } from '../module.config';
import { AdminProductListParams } from '../types/admin-product.types';
import { AdminProductFormValues } from '../validation/product.schema';
import { toast } from 'sonner';

/**
 * List hook — staleTime: 0 because params include search/filters.
 * Query key uses JSON.stringify(params) to avoid referential equality issues on re-renders.
 */
export function useAdminProducts(params?: AdminProductListParams) {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_MODULE_CONFIG.queryKeys.list(params),
    queryFn: () => AdminProductsAPI.fetchAll(params),
    staleTime: 0,
  });
}

export function useAdminProductDetail(id: string) {
  return useQuery({
    queryKey: ADMIN_PRODUCTS_MODULE_CONFIG.queryKeys.detail(id),
    queryFn: () => AdminProductsAPI.fetchById(id),
    enabled: !!id,
    staleTime: 30 * 1000,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AdminProductFormValues) => AdminProductsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_MODULE_CONFIG.queryKeys.all });
      toast.success('Product created successfully');
    },
    onError: () => toast.error('Failed to create product'),
  });
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<AdminProductFormValues>) => AdminProductsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_MODULE_CONFIG.queryKeys.all });
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_MODULE_CONFIG.queryKeys.detail(id) });
      toast.success('Product updated successfully');
    },
    onError: () => toast.error('Failed to update product'),
  });
}

export function useDeleteProducts() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) => AdminProductsAPI.delete(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_PRODUCTS_MODULE_CONFIG.queryKeys.all });
      toast.success('Products deleted successfully');
    },
    onError: (error: any) => {
      // 400 with used_in = product has active references (orders etc.)
      if (error?.response?.status === 400 && error?.response?.data?.used_in) {
        return; // caller handles this by showing ReferencingModal
      }
      toast.error('Failed to delete products');
    },
  });
}
