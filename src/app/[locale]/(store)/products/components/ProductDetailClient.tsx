'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useProductDetail } from '../hooks/useProducts';
import { PageLoading } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX, Minus, Plus, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAddToCart } from '../../cart/hooks/useCart';
import { toast } from 'sonner';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { useLocalizedName, useLocalizedDescription } from '@/lib/i18n-content';
import { WeightVariant } from '@/types/product';
import { cn } from '@/lib/utils';
import { RelatedProducts } from './RelatedProducts';

interface ProductDetailClientProps {
  slug: string;
}

export function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('products');
  const { data: product, isLoading, isError } = useProductDetail(slug);
  const productName = useLocalizedName(product ?? {});
  const productDescription = useLocalizedDescription(product ?? {});
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<WeightVariant | null>(null);

  // Auto-select the first variant once the product is loaded (effect, not render-phase state update).
  useEffect(() => {
    if (product?.unitType === 'WEIGHT' && product.weightVariants?.length && !selectedVariant) {
      setSelectedVariant(product.weightVariants[0]);
    }
  }, [product, selectedVariant]);

  if (isLoading) return <PageLoading />;

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <EmptyState
          icon={<PackageX className="w-12 h-12" />}
          title={t('notFound.title', { defaultMessage: 'Product not found' })}
          description={t('notFound.description', { defaultMessage: 'The product you are looking for does not exist or has been removed.' })}
          action={<Button onClick={() => window.history.back()}>{t('notFound.goBack', { defaultMessage: 'Go Back' })}</Button>}
        />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.unitType === 'WEIGHT' && !selectedVariant) {
      toast.error(t('toast.selectWeight', { defaultMessage: 'Please select a weight option' }));
      return;
    }

    addToCart(
      {
        productId: product.id,
        weightVariantId: selectedVariant?.id,
        quantity,
      },
      {
        onSuccess: () => {
          toast.success(t('toast.addedToCart', { defaultMessage: 'Added to cart' }));
          setQuantity(1);
        },
      }
    );
  };

  const currentPrice = product.unitType === 'WEIGHT'
    ? (selectedVariant?.price ?? 0)
    : (product.fixedPrice ?? 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-muted overflow-hidden border relative">
            {product.thumbnailUrl ? (
              <Image
                src={product.thumbnailUrl}
                alt={productName}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                {t('noImage', { defaultMessage: 'No Image Available' })}
              </div>
            )}
          </div>
          {/* Gallery thumbnails would go here */}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          {product.brand && (
            <span className="text-sm text-primary font-medium tracking-wider uppercase mb-2">
              {product.brand}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            {productName}
          </h1>

          <div className="text-3xl font-bold text-primary mb-6">
            {formatPrice(currentPrice)}
            {product.unitType === 'WEIGHT' && !selectedVariant && <span className="text-sm text-muted-foreground ms-2 font-normal">/ {t('kgBase', { defaultMessage: 'kg base' })}</span>}
          </div>

          {productDescription && (
            <p className="text-muted-foreground text-base leading-relaxed mb-8 whitespace-pre-wrap">
              {productDescription}
            </p>
          )}

          <div className="bg-card border rounded-2xl p-6 space-y-6">
            {/* Weight Options */}
            {product.unitType === 'WEIGHT' && product.weightVariants && product.weightVariants.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">{t('selectWeight', { defaultMessage: 'Select Weight' })}</label>
                <div className="flex flex-wrap gap-2">
                  {product.weightVariants.map(variant => (
                    <Button
                      key={variant.id}
                      variant="outline"
                      onClick={() => setSelectedVariant(variant)}
                      className={cn(
                        "transition-all",
                        selectedVariant?.id === variant.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50 text-foreground bg-transparent"
                      )}
                    >
                      {variant.weightOption?.label ?? `${variant.stockInGrams ?? 0}g`}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium">{t('quantity', { defaultMessage: 'Quantity' })}</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="hover:bg-muted text-muted-foreground transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <span className="text-sm text-muted-foreground">
                  {product.stockInGrams > 0 ? t('inStock', { defaultMessage: 'In Stock' }) : t('outOfStock', { defaultMessage: 'Out of Stock' })}
                </span>
              </div>
            </div>

            {/* Add to Cart Action */}
            <Button
              size="lg"
              className="w-full h-14 text-lg font-bold gap-2 mt-4 shadow-xl shadow-primary/20"
              onClick={handleAddToCart}
              disabled={product.stockInGrams <= 0 || isAddingToCart}
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart
                ? t('toast.adding', { defaultMessage: 'Adding...' })
                : `${t('addToCart', { defaultMessage: 'Add to Cart' })} • ${formatPrice(currentPrice * quantity)}`}
            </Button>
          </div>
        </div>
      </div>

      <RelatedProducts categorySlug={product.category?.slug} currentProductId={product.id} />
    </div>
  );
}
