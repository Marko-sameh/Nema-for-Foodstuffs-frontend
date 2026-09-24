import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UnitType } from '@/types/product';

// NOTE: The server cart (see cart/hooks/useCart.ts) is now the source of truth
// for cart contents. This store is kept as a lightweight mirror so shared UI
// (header badge, product cards) that reads it synchronously still works, and
// to hold the signed guest cart session id used on every /cart request.
export interface CartItem {
  id: string; // server cart item id (or productId[-variantId] before first sync)
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  unitType: UnitType;
  weightInGrams?: number;
  thumbnailUrl?: string;
}

interface CartState {
  items: CartItem[];
  sessionId: string | null;
  setSessionId: (id: string) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setItems: (items: CartItem[]) => void; // Used to sync from server responses
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      sessionId: null,
      setSessionId: (sessionId) => set({ sessionId }),
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ items: [] }),
      setItems: (items) => set({ items }),
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items, sessionId: state.sessionId }),
    }
  )
);
