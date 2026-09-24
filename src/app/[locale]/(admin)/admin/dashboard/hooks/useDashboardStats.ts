import { useQuery } from '@tanstack/react-query';
import { ADMIN_DASHBOARD_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Order } from '@/types/order';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChangePercent: number;
  ordersChangePercent: number;
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_CONFIG.queryKeys.stats,
    queryFn: async () => {
      return api.get<ApiResponse<DashboardStats>>(ADMIN_DASHBOARD_CONFIG.endpoints.stats);
    },
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_CONFIG.queryKeys.recentOrders,
    queryFn: async () => {
      return api.get<ApiResponse<Order[]>>(ADMIN_DASHBOARD_CONFIG.endpoints.recentOrders);
    },
  });
}
