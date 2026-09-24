import { formatWeight, getVariantPrice } from '@/lib/utils';
import { Product, WeightVariant } from '@/types/product';
import { VariantOption } from '../types/product.types';

/**
 * Transform raw WeightVariant from API into display-ready VariantOption.
 */
export function transformVariantsToOptions(
  variants: WeightVariant[],
  pricePerKg?: number,
): VariantOption[] {
  return variants.map((v) => ({
    id: v.id,
    label: formatWeight(v.weightOption?.valueInGrams ?? 0),
    price: v.price ?? getVariantPrice(pricePerKg, v.weightOption?.valueInGrams ?? 0),
    inStock: (v.stockInGrams ?? 0) > 0,
  }));
}

/**
 * Build the unique cart item ID for a product/variant combination.
 * Keeps cart store IDs consistent across the module.
 */
export function buildCartItemId(productId: string, variantId?: string): string {
  return variantId ? `${productId}-${variantId}` : productId;
}

/**
 * Returns the display price for a product depending on its unit type.
 */
export function resolveDisplayPrice(product: Product, selectedVariantId?: string): number {
  if (product.unitType === 'PIECE') return product.fixedPrice ?? 0;
  if (selectedVariantId && product.weightVariants) {
    const variant = product.weightVariants.find((v) => v.id === selectedVariantId);
    if (variant) return variant.price ?? getVariantPrice(product.pricePerKg, variant.weightOption?.valueInGrams ?? 0);
  }
  return product.pricePerKg ?? 0;
}
