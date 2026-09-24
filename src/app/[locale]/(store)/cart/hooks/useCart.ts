import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { CartAPI } from '../domain/cart.api';
import { CART_MODULE_CONFIG } from '../module.config';
import { AddToCartPayload, ServerCart } from '../types/cart.types';
import { useCartStore } from '@/store/cartStore';

function syncLocalCart(serverCart: ServerCart) {
  useCartStore.getState().setItems(
    serverCart.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      variantId: i.weightVariantId,
      name: i.product?.name ?? '',
      price: i.price,
      quantity: i.quantity,
      unitType: i.product?.unitType ?? 'PIECE',
      thumbnailUrl: i.product?.thumbnailUrl,
    }))
  );
}

function friendlyError(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;
    if (status === 409) {
      return serverMessage || 'Sorry, this item is out of stock or the requested quantity is unavailable.';
    }
    return serverMessage || fallback;
  }
  return fallback;
}

/** Fetches (and persists) the signed guest cart session id, once per browser. */
export function useCartSession() {
  const sessionId = useCartStore((s) => s.sessionId);
  const setSessionId = useCartStore((s) => s.setSessionId);

  return useQuery({
    queryKey: CART_MODULE_CONFIG.queryKeys.session,
    queryFn: async () => {
      if (sessionId) return sessionId;
      const res = await CartAPI.fetchSession();
      setSessionId(res.sessionId);
      return res.sessionId;
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });
}

export function useServerCart() {
  const { data: sessionId, isLoading: isSessionLoading, isError: isSessionError } = useCartSession();

  const query = useQuery({
    queryKey: CART_MODULE_CONFIG.queryKeys.cart,
    queryFn: CartAPI.fetchCart,
    enabled: !!sessionId,
    staleTime: 30 * 1000,
  });

  return {
    ...query,
    isLoading: isSessionLoading || (!!sessionId && query.isLoading),
    isError: isSessionError || query.isError,
  };
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartPayload) => CartAPI.addItem(payload),
    onSuccess: (serverCart) => {
      queryClient.setQueryData(CART_MODULE_CONFIG.queryKeys.cart, serverCart);
      syncLocalCart(serverCart);
    },
    onError: (error) => {
      toast.error(friendlyError(error, 'Failed to add item to cart'));
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      CartAPI.updateItem(itemId, { quantity }),
    onMutate: async ({ itemId, quantity }) => {
      await queryClient.cancelQueries({ queryKey: CART_MODULE_CONFIG.queryKeys.cart });
      const previousCart = queryClient.getQueryData<ServerCart>(CART_MODULE_CONFIG.queryKeys.cart);
      if (previousCart) {
        queryClient.setQueryData<ServerCart>(CART_MODULE_CONFIG.queryKeys.cart, {
          ...previousCart,
          items: previousCart.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
        });
      }
      return { previousCart };
    },
    onError: (error, _vars, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_MODULE_CONFIG.queryKeys.cart, context.previousCart);
      }
      toast.error(friendlyError(error, 'Failed to update quantity'));
    },
    onSuccess: (serverCart) => {
      queryClient.setQueryData(CART_MODULE_CONFIG.queryKeys.cart, serverCart);
      syncLocalCart(serverCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_MODULE_CONFIG.queryKeys.cart });
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => CartAPI.removeItem(itemId),
    onMutate: async (itemId) => {
      await queryClient.cancelQueries({ queryKey: CART_MODULE_CONFIG.queryKeys.cart });
      const previousCart = queryClient.getQueryData<ServerCart>(CART_MODULE_CONFIG.queryKeys.cart);
      if (previousCart) {
        queryClient.setQueryData<ServerCart>(CART_MODULE_CONFIG.queryKeys.cart, {
          ...previousCart,
          items: previousCart.items.filter((i) => i.id !== itemId),
        });
      }
      return { previousCart };
    },
    onError: (error, _itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_MODULE_CONFIG.queryKeys.cart, context.previousCart);
      }
      toast.error(friendlyError(error, 'Failed to remove item'));
    },
    onSuccess: () => {
      toast.success('Item removed from cart');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_MODULE_CONFIG.queryKeys.cart });
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => CartAPI.clearCart(),
    onSuccess: () => {
      queryClient.setQueryData(CART_MODULE_CONFIG.queryKeys.cart, {
        items: [],
        subtotal: 0,
        total: 0,
        itemCount: 0,
      });
      useCartStore.getState().clearCart();
    },
    onError: (error) => {
      toast.error(friendlyError(error, 'Failed to clear cart'));
    },
  });
}
