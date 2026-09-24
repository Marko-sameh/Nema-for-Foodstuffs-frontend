import { PaymentMethod } from '@/types/order';
import { Address } from '@/types/user';

export interface CheckoutSummary {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export interface CheckoutState {
  addressId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
  couponDiscount: number;
}

export interface ApplyCouponResponse {
  valid: boolean;
  discount: number;
  message?: string;
}
