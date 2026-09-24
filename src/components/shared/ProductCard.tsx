'use client';

import { Product } from '@/types/product';
import { Link, useRouter } from '@/i18n/navigation';
import { useAddToCart } from '@/app/[locale]/(store)/cart/hooks/useCart';
import { toast } from 'sonner';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { useLocalizedName } from '@/lib/i18n-content';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { WishlistAPI } from '@/app/[locale]/(store)/wishlist/hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { Plus, Heart } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations('common');
  const { formatPrice } = useLocaleFormat();
  const productName = useLocalizedName(product);
  const router = useRouter();
  const { mutate: addToCart, isPending } = useAddToCart();
  const [selectedVariant, setSelectedVariant] = useState(
    product.weightVariants?.[0] ?? null
  );

  const { productIds, setWishlist } = useWishlistStore();
  const isWishlisted = productIds.includes(product.id);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const user = useAuthStore.getState().user;
    if (!user) {
      toast.info(t('auth.loginRequired', { defaultMessage: 'Please login to manage your wishlist' }), {
        action: { label: t('auth.login', { defaultMessage: 'Login' }), onClick: () => router.push('/login') },
      });
      return;
    }

    const newProductIds = isWishlisted 
      ? productIds.filter(id => id !== product.id)
      : [...productIds, product.id];
    
    setWishlist(newProductIds);

    try {
      if (isWishlisted) {
        await WishlistAPI.removeFromWishlist(product.id);
        toast.success(t('product.removedFromWishlist', { name: productName, defaultMessage: '{name} removed from wishlist' }));
      } else {
        await WishlistAPI.addToWishlist(product.id);
        toast.success(t('product.addedToWishlist', { name: productName, defaultMessage: '{name} added to wishlist' }));
      }
    } catch (error) {
      setWishlist(productIds);
      toast.error(t('product.wishlistError', { defaultMessage: 'Could not update wishlist' }));
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.unitType === 'WEIGHT' && !selectedVariant) {
      toast.info(t('product.selectWeightFirst', { defaultMessage: 'Select a weight first' }), {
        action: { label: t('actions.view', { defaultMessage: 'View' }), onClick: () => router.push(`/products/${product.slug}`) },
      });
      return;
    }

    addToCart(
      {
        productId: product.id,
        weightVariantId: selectedVariant?.id,
        quantity: 1,
      },
      {
        onSuccess: () => {
          toast.success(t('product.addedToCart', { name: productName, defaultMessage: '{name} added to cart' }));
        },
      }
    );
  };

  const displayPrice = selectedVariant
    ? formatPrice(selectedVariant.price)
    : product.unitType === 'WEIGHT'
      ? `${formatPrice(product.pricePerKg ?? 0)}/${t('product.kg', { defaultMessage: 'kg' })}`
      : formatPrice(product.fixedPrice ?? 0);

  return (
    <Link href={`/products/${product.slug}`} className="group block h-full">
      <div className="flex h-full flex-col">
        {/* Image area */}
        <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-accent">
          {product.thumbnailUrl ? (
            <Image
              src={product.thumbnailUrl}
              alt={productName}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-6xl">
              {product.unitType === 'WEIGHT' ? '🌿' : '📦'}
            </span>
          )}

          {/* Badges */}
          <div className="absolute top-3 start-3 flex flex-col items-start gap-1.5">
            {product.isFeatured && (
              <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary-foreground">
                {t('product.badges.featured', { defaultMessage: 'Featured' })}
              </span>
            )}
            {product.unitType === 'WEIGHT' && (
              <span className="rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-foreground">
                {t('product.badges.byWeight', { defaultMessage: 'By Weight' })}
              </span>
            )}
          </div>

          {/* Wishlist toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 end-3 h-8 w-8 rounded-full bg-background/70 backdrop-blur-sm text-muted-foreground transition-all hover:bg-background hover:text-red-500 hover:scale-110"
          >
            <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Quick add */}
          <Button
            onClick={handleAddToCart}
            disabled={isPending}
            aria-label={t('actions.add', { defaultMessage: 'Add' })}
            className="absolute bottom-3 end-3 h-11 w-11 rounded-full bg-foreground p-0 text-background opacity-0 transition-opacity duration-300 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 focus-visible:opacity-100"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1 pt-4">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {product.brand || (product.unitType === 'WEIGHT' ? t('product.types.weight', { defaultMessage: 'Per Kilo' }) : t('product.types.piece', { defaultMessage: 'Per Piece' }))}
          </div>
          <div className="font-display text-lg leading-tight text-foreground line-clamp-2">
            {productName}
          </div>

          {/* Weight pills */}
          {product.unitType === 'WEIGHT' && product.weightVariants && product.weightVariants.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5" onClick={e => e.preventDefault()}>
              {product.weightVariants.map(v => {
                const isActive = selectedVariant?.id === v.id;
                return (
                  <Button
                    key={v.id}
                    variant="outline"
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariant(v); }}
                    className={`h-auto rounded-full px-3 py-1 text-[11px] transition-colors ${
                      isActive
                        ? 'border-foreground bg-foreground text-background font-bold hover:bg-foreground hover:text-background'
                        : 'border-border bg-transparent text-muted-foreground font-medium hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {v.weightOption?.label ?? v.id}
                  </Button>
                );
              })}
            </div>
          )}

          <div className="mt-auto pt-3 text-base font-bold text-foreground">
            {displayPrice}
          </div>
        </div>
      </div>
    </Link>
  );
}
