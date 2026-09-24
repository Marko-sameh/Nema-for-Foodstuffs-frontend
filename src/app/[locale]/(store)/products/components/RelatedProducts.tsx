'use client';

import { useTranslations } from 'next-intl';
import { useProductsList } from '../hooks/useProducts';
import { ProductCard } from '@/components/shared/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedProductsProps {
  categorySlug?: string;
  currentProductId: string;
}

export function RelatedProducts({ categorySlug, currentProductId }: RelatedProductsProps) {
  const t = useTranslations('products');
  const { data, isLoading } = useProductsList({
    filters: categorySlug ? { category: categorySlug } : {},
    limit: 8,
  });

  const products = (data?.data ?? []).filter((p) => p.id !== currentProductId).slice(0, 4);

  if (!isLoading && products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <span className="eyebrow">{t('related.eyebrow', { defaultMessage: 'You may also like' })}</span>
      <h2 className="display-lg mb-8 mt-2 text-foreground">
        {t('related.title', { defaultMessage: 'Related products' })}
      </h2>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-[1.75rem]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
