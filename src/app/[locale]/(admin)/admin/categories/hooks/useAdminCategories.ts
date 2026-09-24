import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ADMIN_CATEGORIES_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Category } from '@/types/product';
import { CategoryFormData } from '../validation/category.schema';
import { toast } from 'sonner';

export function useAdminCategories() {
  return useQuery({
    queryKey: ADMIN_CATEGORIES_CONFIG.queryKeys.list(),
    queryFn: async () => {
      return api.get<ApiResponse<Category[]>>(ADMIN_CATEGORIES_CONFIG.endpoints.list);
    },
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryFormData) => {
      return api.post<ApiResponse<Category>>(ADMIN_CATEGORIES_CONFIG.endpoints.create, data);
    },
    onSuccess: () => {
      toast.success('Category created successfully');
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to create category');
    }
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CategoryFormData }) => {
      return api.put<ApiResponse<Category>>(ADMIN_CATEGORIES_CONFIG.endpoints.update(id), data);
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to update category');
    }
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<ApiResponse<null>>(ADMIN_CATEGORIES_CONFIG.endpoints.delete(id));
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to delete category');
    }
  });
}
