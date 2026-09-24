import { useMemo } from 'react';
import { useProductsList } from './useProducts';

/**
 * Derive the list of real brands from the catalogue instead of hardcoding them.
 * Uses a single large product page; the catalogue is small enough for this.
 */
export function useBrands(): string[] {
  const { data } = useProductsList({ limit: 100 });

  return useMemo(() => {
    const brands = new Set<string>();
    for (const product of data?.data ?? []) {
      if (product.brand) brands.add(product.brand);
    }
    return Array.from(brands).sort((a, b) => a.localeCompare(b));
  }, [data]);
}
