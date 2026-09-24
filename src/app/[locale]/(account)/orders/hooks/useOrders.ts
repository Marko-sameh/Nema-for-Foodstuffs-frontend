import { useQuery } from '@tanstack/react-query';
import { ORDERS_MODULE_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { Order, OrderItem } from '@/types/order';

function transformOrder(data: any): Order {
  return {
    id: data.id,
    userId: data.user_id || data.userId,
    addressId: data.address_id || data.addressId,
    status: data.status,
    paymentStatus: data.payment_status || data.paymentStatus,
    paymentMethod: data.payment_method || data.paymentMethod,
    subtotal: data.subtotal,
    deliveryFee: data.shipping_fee ?? data.deliveryFee ?? 0,
    discount: data.discount ?? 0,
    total: data.total,
    couponCode: data.coupon_code || data.couponCode,
    notes: data.notes,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
    items: data.items?.map((item: any): OrderItem => ({
      id: item.id,
      orderId: item.order_id || item.orderId,
      productId: item.product_id || item.productId,
      productName: item.product_name_snapshot || item.productName || 'Unknown Product',
      unitType: item.unit_type || item.unitType || 'PIECE',
      quantity: item.quantity,
      price: item.unit_price ?? item.price,
      weightVariantId: item.weight_variant_id || item.weightVariantId,
    })),
  };
}

export function useCustomerOrders() {
  return useQuery({
    queryKey: ORDERS_MODULE_CONFIG.queryKeys.list(),
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<any>>(ORDERS_MODULE_CONFIG.endpoints.list);
      return {
        ...res,
        data: res.data.map(transformOrder),
      } as PaginatedResponse<Order>;
    },
  });
}

export function useCustomerOrderDetail(id: string) {
  return useQuery({
    queryKey: ORDERS_MODULE_CONFIG.queryKeys.detail(id),
    queryFn: async () => {
      const res = await api.get<any>(ORDERS_MODULE_CONFIG.endpoints.detail(id));
      if (res && res.data && !res.id) {
        return transformOrder(res.data);
      }
      return transformOrder(res);
    },
    enabled: !!id,
  });
}
