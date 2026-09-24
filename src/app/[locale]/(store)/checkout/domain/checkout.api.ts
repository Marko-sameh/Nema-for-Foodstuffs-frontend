import { api } from '@/lib/api';
import { Order } from '@/types/order';
import { CHECKOUT_MODULE_CONFIG } from '../module.config';
import { CheckoutFormValues } from '../validation/checkout.schema';
import { ApplyCouponResponse } from '../types/checkout.types';

export class CheckoutAPI {
  static async createOrder(
    payload: CheckoutFormValues & { items: Array<{ productId: string; variantId?: string | null; quantity: number }> },
    idempotencyKey: string
  ): Promise<Order> {
    return api.post<Order>(CHECKOUT_MODULE_CONFIG.endpoints.createOrder, payload, {
      headers: { 'Idempotency-Key': idempotencyKey },
    });
  }

  static async applyCoupon(code: string): Promise<ApplyCouponResponse> {
    return api.post<ApplyCouponResponse>(CHECKOUT_MODULE_CONFIG.endpoints.applyCoupon, { code });
  }
}
