'use client';

import { ProductCard } from '@/components/shared/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useProductsList } from '../hooks/useProducts';
import { ProductFilters } from '../types/product.types';

interface ProductListProps {
  filters?: ProductFilters;
  page?: number;
  limit?: number;
}

export function ProductList({ filters, page = 1, limit = 12 }: ProductListProps) {
  const t = useTranslations('products');
  const { data, isLoading, isError } = useProductsList({ filters, page, limit });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (isError || !data?.data?.length) {
    return (
      <EmptyState
        icon={<PackageX className="w-10 h-10" />}
        title={t('empty.title', { defaultMessage: 'No products found' })}
        description={t('empty.desc', { defaultMessage: 'Try adjusting your filters or search term.' })}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.data.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
