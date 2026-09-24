import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  toggle: (productId: string) => void;
  setWishlist: (productIds: string[]) => void;
  isWishlisted: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggle: (productId) =>
        set((state) => {
          const exists = state.productIds.includes(productId);
          if (exists) {
            return { productIds: state.productIds.filter((id) => id !== productId) };
          }
          return { productIds: [...state.productIds, productId] };
        }),
      setWishlist: (productIds) => set({ productIds }),
      isWishlisted: (productId) => get().productIds.includes(productId),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
