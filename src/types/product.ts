export type UnitType = 'WEIGHT' | 'PIECE';

export interface WeightOption {
  id: string;
  label: string;
  valueInGrams: number;
  isActive: boolean;
}

export interface WeightVariant {
  id: string;
  weightOptionId: string;
  price: number;
  stockInGrams: number | null;
  sku?: string;
  weightOption?: WeightOption; // If joined from backend
}

export interface ProductImage {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  unitType: UnitType;
  pricePerKg?: number;
  fixedPrice?: number;
  stockInGrams: number;
  sku: string;
  thumbnailUrl?: string;
  brand?: string;
  isActive: boolean;
  isFeatured: boolean;
  category?: Category;
  weightVariants?: WeightVariant[];
  images?: ProductImage[];
  createdAt: string;
}
