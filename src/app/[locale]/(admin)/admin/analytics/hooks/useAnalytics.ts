import { useQuery } from '@tanstack/react-query';
import { ADMIN_ANALYTICS_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';

export interface RevenueDataPoint {
  date: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalSold: number;
  revenue: number;
}

export function useRevenueAnalytics(days: number = 30) {
  return useQuery({
    queryKey: [...ADMIN_ANALYTICS_CONFIG.queryKeys.revenue, days],
    queryFn: async () => {
      return api.get<RevenueDataPoint[]>(`${ADMIN_ANALYTICS_CONFIG.endpoints.revenue}?days=${days}`);
    },
  });
}

export function useTopProducts() {
  return useQuery({
    queryKey: ADMIN_ANALYTICS_CONFIG.queryKeys.topProducts,
    queryFn: async () => {
      return api.get<TopProduct[]>(ADMIN_ANALYTICS_CONFIG.endpoints.topProducts);
    },
  });
}
