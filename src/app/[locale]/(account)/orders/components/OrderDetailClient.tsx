'use client';

import { useCustomerOrderDetail } from '../hooks/useOrders';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX } from 'lucide-react';
import { OrderStatus } from '@/types/order';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { useTranslations } from 'next-intl';

interface OrderDetailClientProps {
  id: string;
}

export function OrderDetailClient({ id }: OrderDetailClientProps) {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('orders');
  const { data: response, isLoading, isError } = useCustomerOrderDetail(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  const order = response;

  if (isError || !order) {
    return (
      <EmptyState
        icon={<PackageX className="w-12 h-12 text-muted-foreground/50" />}
        title={t('notFound.title', { defaultMessage: 'Order not found' })}
        description={t('notFound.description', { defaultMessage: "We couldn't find the details for this order." })}
        action={
          <Link href="/orders">
            <Button>{t('notFound.back', { defaultMessage: 'Back to Orders' })}</Button>
          </Link>
        }
      />
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumb 
        items={[
          { label: t('nav.orders', { defaultMessage: 'Orders' }), href: '/orders' },
          { label: `${t('orderNumber', { defaultMessage: 'Order #' })}${order.id.slice(-6)}` }
        ]} 
      />
      
      {/* Header Info */}
      <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">{t('orderNumber', { defaultMessage: 'Order #' })}{order.id.slice(-6)}</h2>
          <p className="text-muted-foreground text-sm">
            {t('placedOn', { defaultMessage: 'Placed on ' })}{
              (() => {
                const dateVal = order.createdAt;
                const d = dateVal ? new Date(dateVal) : null;
                return d && !isNaN(d.getTime()) ? format(d, 'MMMM dd, yyyy at h:mm a') : 'Unknown date';
              })()
            }
          </p>
        </div>
        <div className="flex flex-col gap-2 md:items-end">
          <Badge variant="outline" className={`${getStatusColor(order.status)} text-base px-3 py-1`}>
            {order.status}
          </Badge>
          <span className="text-sm font-medium text-muted-foreground">
            {t('payment', { defaultMessage: 'Payment:' })} {order.paymentStatus} ({order.paymentMethod})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold">{t('orderItems', { defaultMessage: 'Order Items' })}</h3>
          <div className="bg-card border rounded-xl divide-y">
            {order.items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center font-bold text-muted-foreground shrink-0">
                    {(item.productName || '?').charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.productName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="font-bold text-lg text-end shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">{t('summary', { defaultMessage: 'Summary' })}</h3>
          <div className="bg-card border rounded-xl p-6 space-y-4">
            <div className="flex justify-between text-muted-foreground">
              <span>{t('subtotal', { defaultMessage: 'Subtotal' })}</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{t('deliveryFee', { defaultMessage: 'Delivery Fee' })}</span>
              <span>{formatPrice(order.deliveryFee ?? 0)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>{t('discount', { defaultMessage: 'Discount' })}</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-xl">
              <span>{t('total', { defaultMessage: 'Total' })}</span>
              <span className="text-primary">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
