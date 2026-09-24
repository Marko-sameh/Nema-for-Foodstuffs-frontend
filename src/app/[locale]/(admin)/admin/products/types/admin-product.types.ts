import { Product, UnitType } from '@/types/product';

// ─── Admin Product Form State ────────────────────────────────────────────────
export interface AdminProductFormState {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brand: string;
  unitType: UnitType;
  pricePerKg?: number;
  fixedPrice?: number;
  stockInGrams: number;
  isFeatured: boolean;
  isActive: boolean;
  weightVariants: AdminWeightVariantInput[];
}

export interface AdminWeightVariantInput {
  weightOptionId: string;
  price?: number;
  stockInGrams?: number;
}

// ─── API Params ──────────────────────────────────────────────────────────────
export interface AdminProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  isActive?: boolean;
}

export interface AdminProductListResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
}
