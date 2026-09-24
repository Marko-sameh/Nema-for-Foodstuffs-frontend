'use client';

import { useTranslations } from 'next-intl';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link } from '@/i18n/navigation';
import { ShoppingCart } from 'lucide-react';

interface CartSummaryProps {
  subtotal: number;
  shippingFee: number;
  itemCount: number;
  isShippingLoading?: boolean;
}

export function CartSummary({ subtotal, shippingFee, itemCount, isShippingLoading }: CartSummaryProps) {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('cart');
  const total = subtotal + shippingFee;

  return (
    <div className="bg-card border rounded-xl p-6 space-y-4 sticky top-24">
      <h2 className="text-lg font-bold">{t('summary', { defaultMessage: 'Order Summary' })}</h2>
      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('subtotal', { defaultMessage: 'Subtotal' })}</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t('delivery', { defaultMessage: 'Delivery' })}</span>
          <span>{isShippingLoading ? '…' : formatPrice(shippingFee)}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between font-bold text-base">
        <span>{t('total', { defaultMessage: 'Total' })}</span>
        <span className="text-primary">{formatPrice(total)}</span>
      </div>

      <Link href="/checkout">
        <Button className="w-full gap-2" disabled={itemCount === 0}>
          <ShoppingCart className="h-4 w-4" />
          {t('checkout', { defaultMessage: 'Proceed to Checkout' })}
        </Button>
      </Link>
    </div>
  );
}
