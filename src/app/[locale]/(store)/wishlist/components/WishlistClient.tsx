'use client';

import { useWishlistStore } from '@/store/wishlistStore';
import { useProductsList } from '../../products/hooks/useProducts';
import { ProductCard } from '@/components/shared/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { Heart, HeartOff } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export function WishlistClient() {
  const t = useTranslations('wishlist');
  const productIds = useWishlistStore((s) => s.productIds);
  
  // A real backend would have a dedicated /wishlist endpoint or allow array of IDs in filters.
  // For the frontend structure, we'll assume useProductsList can fetch multiple products if we had a backend.
  // Since we don't have an array-of-ids filter in the mock, we'll just fetch all and filter client-side for the showcase.
  const { data, isLoading, isError } = useProductsList({ limit: 100 });

  if (productIds.length === 0) {
    return (
      <div className="py-16 max-w-2xl mx-auto">
        <EmptyState
          icon={<HeartOff className="w-16 h-16 text-muted-foreground/50" />}
          title={t('emptyTitle', { defaultMessage: 'Your wishlist is empty' })}
          description={t('emptyDescription', { defaultMessage: 'Save items you love to your wishlist. Review them anytime and easily move them to your cart.' })}
          action={
            <Link href="/products">
              <Button size="lg" className="mt-4">{t('exploreProducts', { defaultMessage: 'Explore Products' })}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  const allProducts = data?.data || [];
  // Client-side filtering just for the mock setup.
  const wishlistedProducts = allProducts.filter(p => productIds.includes(p.id));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {wishlistedProducts.map((product) => (
        <div key={product.id} className="relative group">
          <ProductCard product={product} />
        </div>
      ))}
      
      {wishlistedProducts.length === 0 && !isError && (
        <div className="col-span-full">
          <p className="text-muted-foreground">{t('unavailable', { defaultMessage: 'The items in your wishlist are currently unavailable.' })}</p>
        </div>
      )}
    </div>
  );
}
