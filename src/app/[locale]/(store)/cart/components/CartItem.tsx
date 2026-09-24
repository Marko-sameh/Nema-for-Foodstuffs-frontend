'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { useLocalizedName } from '@/lib/i18n-content';
import { ServerCartItem } from '../types/cart.types';
import { useUpdateCartItem, useRemoveFromCart } from '../hooks/useCart';

interface CartItemProps {
  item: ServerCartItem;
}

export function CartItem({ item }: CartItemProps) {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('cart');
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();

  const isMutating = isUpdating || isRemoving;
  const name = useLocalizedName(item.product ?? {});
  const thumbnailUrl = item.product?.thumbnailUrl;

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 relative">
        {thumbnailUrl ? (
          <Image src={thumbnailUrl} alt={name} fill sizes="80px" className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            {t('noImage', { defaultMessage: 'No image' })}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium truncate">{name}</h4>
        <p className="text-primary font-semibold mt-1">{formatPrice(item.price)}</p>

        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={isMutating}
            onClick={() =>
              item.quantity > 1
                ? updateItem({ itemId: item.id, quantity: item.quantity - 1 })
                : removeItem(item.id)
            }
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            disabled={isMutating}
            onClick={() => updateItem({ itemId: item.id, quantity: item.quantity + 1 })}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        disabled={isMutating}
        onClick={() => removeItem(item.id)}
        className="text-destructive hover:text-destructive flex-shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
