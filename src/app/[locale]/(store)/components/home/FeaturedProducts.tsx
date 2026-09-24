'use client';

import { useProductsList } from '../../products/hooks/useProducts';
import { ProductCard } from '@/components/shared/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function FeaturedProducts() {
  const t = useTranslations('home.featured');
  const { data, isLoading } = useProductsList({
    filters: { isFeatured: true },
    limit: 4,
  });

  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-14">
        <h2 className="display-lg mb-8 text-foreground">{t('title', { defaultMessage: 'Featured Products' })}</h2>
        <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-[1.75rem]" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  const products = data?.data || [];

  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">{t('eyebrow', { defaultMessage: 'Freezer favourites' })}</span>
          <h2 className="display-lg mt-2 text-foreground">{t('title', { defaultMessage: 'Featured Products' })}</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            {t('subtitle', { defaultMessage: 'Hand-picked fresh produce just for you.' })}
          </p>
        </div>
        <Link
          href="/products"
          className="border-b-2 border-foreground pb-1 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {t('viewAll', { defaultMessage: 'View All' })}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
