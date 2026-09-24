import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ADMIN_USERS_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { User, Role } from '@/types/user';
import { toast } from 'sonner';

export interface AdminUserListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}

export function useAdminUsers(params?: AdminUserListParams) {
  return useQuery({
    queryKey: ADMIN_USERS_CONFIG.queryKeys.list(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.search) searchParams.append('search', params.search);
      if (params?.role) searchParams.append('role', params.role);
      
      const queryString = searchParams.toString();
      const url = `${ADMIN_USERS_CONFIG.endpoints.list}${queryString ? `?${queryString}` : ''}`;
      
      return api.get<PaginatedResponse<User>>(url);
    },
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }: { id: string; role: Role }) => {
      return api.patch<ApiResponse<User>>(ADMIN_USERS_CONFIG.endpoints.updateRole(id), { role });
    },
    onSuccess: (_, variables) => {
      toast.success(`User role updated to ${variables.role}`);
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to update user role');
    }
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<ApiResponse<null>>(ADMIN_USERS_CONFIG.endpoints.delete(id));
    },
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to delete user');
    }
  });
}
