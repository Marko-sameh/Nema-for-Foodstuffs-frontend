import { Product } from '@/types/product';
import { UnitType } from '@/types/product';

// ─── Cart Session ─────────────────────────────────────────────────────────────
export interface CartSessionResponse {
  sessionId: string;
}

// ─── Cart API Response ───────────────────────────────────────────────────────
export interface ServerCartItem {
  id: string;
  productId: string;
  weightVariantId?: string;
  quantity: number;
  price: number;
  product?: Pick<Product, 'name' | 'nameAr' | 'nameEn' | 'thumbnailUrl' | 'unitType'>;
}

export interface ServerCart {
  items: ServerCartItem[];
  subtotal: number;
  total: number;
  itemCount: number;
}

// ─── Add to Cart ─────────────────────────────────────────────────────────────
export interface AddToCartPayload {
  productId: string;
  weightVariantId?: string;
  quantity: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export type { UnitType };
