'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus, ShoppingBag, AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { PageLoading } from '@/components/shared/LoadingState';
import { CartSummary } from './CartSummary';
import { useServerCart, useUpdateCartItem, useRemoveFromCart } from '../hooks/useCart';
import { useSettings } from '../../settings/hooks/useSettings';

export function CartPageClient() {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('cart');
  const { data: cart, isLoading, isError, refetch } = useServerCart();
  const { data: settings, isLoading: isSettingsLoading } = useSettings();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: removeItem } = useRemoveFromCart();

  const shippingFee = settings?.shipping_fee !== undefined ? Number(settings.shipping_fee) : 0;

  if (isLoading) {
    return <PageLoading />;
  }

  if (isError) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <EmptyState
          icon={<AlertCircle className="w-16 h-16 text-destructive/60" />}
          title={t('errorTitle', { defaultMessage: 'Could not load your cart' })}
          description={t('errorDesc', { defaultMessage: 'Something went wrong while fetching your cart. Please try again.' })}
          action={
            <Button size="lg" className="mt-4" onClick={() => refetch()}>
              {t('retry', { defaultMessage: 'Try Again' })}
            </Button>
          }
        />
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16">
        <EmptyState
          icon={<ShoppingBag className="w-16 h-16 text-muted-foreground/50" />}
          title={t('emptyTitle', { defaultMessage: 'Your cart is empty' })}
          description={t('emptyDesc', { defaultMessage: "Looks like you haven't added anything to your cart yet. Browse our products and find something you love!" })}
          action={
            <Link href="/products">
              <Button size="lg" className="mt-4">{t('startShopping', { defaultMessage: 'Start Shopping' })}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <PageHeader 
        eyebrow={t('eyebrow', { defaultMessage: 'Your Basket' })}
        title={t('title', { defaultMessage: 'Shopping Cart' })} 
        description={t('subtitle', { defaultMessage: 'Review your items before checkout.' })} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => {
            const name = item.product?.name ?? '';
            const thumbnailUrl = item.product?.thumbnailUrl;
            const unitType = item.product?.unitType ?? 'PIECE';

            return (
              <div key={item.id} className="flex gap-4 p-4 border bg-card rounded-2xl relative group">
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 bg-muted rounded-xl overflow-hidden relative">
                  {thumbnailUrl ? (
                    <Image src={thumbnailUrl} alt={name} fill sizes="128px" className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                      {t('noImage', { defaultMessage: 'No image' })}
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 justify-between py-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-semibold text-base sm:text-lg text-foreground line-clamp-2">{name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {unitType === 'WEIGHT' ? t('byWeight', { defaultMessage: 'By Weight' }) : t('byPiece', { defaultMessage: 'By Piece' })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors sm:opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center border rounded-lg overflow-hidden bg-background">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateItem({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                        className="hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-10 sm:w-12 text-center font-medium text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}
                        className="hover:bg-muted text-muted-foreground transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-end">
                      <div className="font-bold text-lg text-primary">{formatPrice(item.price * item.quantity)}</div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground">{formatPrice(item.price)} {t('each', { defaultMessage: 'each' })}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <CartSummary
            subtotal={cart?.subtotal ?? 0}
            shippingFee={shippingFee}
            itemCount={items.length}
            isShippingLoading={isSettingsLoading}
          />
        </div>
      </div>
    </div>
  );
}
