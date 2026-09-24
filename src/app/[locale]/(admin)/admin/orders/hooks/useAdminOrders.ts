import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ADMIN_ORDERS_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { Order, OrderStatus } from '@/types/order';
import { toast } from 'sonner';

export interface AdminOrderListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export function useAdminOrders(params?: AdminOrderListParams) {
  return useQuery({
    queryKey: ADMIN_ORDERS_CONFIG.queryKeys.list(params),
    queryFn: async () => {
      // Convert params to query string
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append('page', params.page.toString());
      if (params?.limit) searchParams.append('limit', params.limit.toString());
      if (params?.status) searchParams.append('status', params.status);
      if (params?.search) searchParams.append('search', params.search);
      
      const queryString = searchParams.toString();
      const url = `${ADMIN_ORDERS_CONFIG.endpoints.list}${queryString ? `?${queryString}` : ''}`;
      
      return api.get<PaginatedResponse<Order>>(url);
    },
  });
}

export function useAdminOrderDetail(id: string) {
  return useQuery({
    queryKey: ADMIN_ORDERS_CONFIG.queryKeys.detail(id),
    queryFn: async () => {
      return api.get<Order>(ADMIN_ORDERS_CONFIG.endpoints.detail(id));
    },
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      return api.patch<Order>(ADMIN_ORDERS_CONFIG.endpoints.updateStatus(id), { status });
    },
    onSuccess: (_, variables) => {
      toast.success(`Order status updated to ${variables.status}`);
      queryClient.invalidateQueries({ queryKey: ADMIN_ORDERS_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to update order status');
    }
  });
}
