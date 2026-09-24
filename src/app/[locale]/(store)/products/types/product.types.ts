import { Product, WeightVariant } from '@/types/product';

// ─── Filter & Params ────────────────────────────────────────────────────────
export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'name';

export interface ProductFilters {
  sort?: ProductSort;
  category?: string;
  categories?: string[];
  brand?: string;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  search?: string;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
}

// ─── API Response ────────────────────────────────────────────────────────────
export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Weight Variant UI ───────────────────────────────────────────────────────
export interface VariantOption {
  id: string;
  label: string;       // e.g. "250g"
  price: number;
  inStock: boolean;
}

// ─── Selected State ──────────────────────────────────────────────────────────
export interface ProductSelection {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
}
