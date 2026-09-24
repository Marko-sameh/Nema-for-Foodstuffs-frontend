import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@/i18n/navigation';
import { CheckoutAPI } from '../domain/checkout.api';
import { CheckoutFormValues } from '../validation/checkout.schema';
import { useCartStore } from '@/store/cartStore';
import { CART_MODULE_CONFIG } from '../../cart/module.config';
import { toast } from 'sonner';

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const clearCartStore = useCartStore((s) => s.clearCart);
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CheckoutFormValues & { items: Array<{ productId: string; variantId?: string | null; quantity: number }> }) => {
      const idempotencyKey = crypto.randomUUID();
      return CheckoutAPI.createOrder(payload, idempotencyKey);
    },
    onSuccess: (order) => {
      // Clear the cart cache (server cart + local mirror) now that the order exists.
      queryClient.setQueryData(CART_MODULE_CONFIG.queryKeys.cart, {
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      });
      queryClient.invalidateQueries({ queryKey: CART_MODULE_CONFIG.queryKeys.cart });
      clearCartStore();
      toast.success('Order placed successfully!');
      router.push(`/orders/${order.id}`);
    },
    onError: () => {
      toast.error('Failed to place order. Please try again.');
    },
  });
}

export function useApplyCoupon() {
  return useMutation({
    mutationFn: (code: string) => CheckoutAPI.applyCoupon(code),
    onError: () => {
      toast.error('Invalid coupon code');
    },
  });
}
