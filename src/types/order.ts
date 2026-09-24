export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'COD' | 'CARD' | 'WALLET';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitType: 'WEIGHT' | 'PIECE';
  quantity: number;
  price: number;
  weightVariantId?: string;
}

export interface Order {
  id: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}
