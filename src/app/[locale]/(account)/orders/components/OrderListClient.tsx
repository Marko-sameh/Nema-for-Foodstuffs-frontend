'use client';

import { useCustomerOrders } from '../hooks/useOrders';
import { format } from 'date-fns';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { OrderStatus } from '@/types/order';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { useTranslations } from 'next-intl';

export function OrderListClient() {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('orders');
  const { data, isLoading, isError } = useCustomerOrders();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const orders = data?.data || [];

  if (orders.length === 0 || isError) {
    return (
      <EmptyState
        icon={<ShoppingBag className="w-12 h-12 text-muted-foreground/50" />}
        title={t('empty.title', { defaultMessage: 'No orders yet' })}
        description={t('empty.description', { defaultMessage: "You haven't placed any orders yet. Start exploring our fresh products!" })}
        action={
          <Link href="/products">
            <Button>{t('empty.action', { defaultMessage: 'Start Shopping' })}</Button>
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
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-card border rounded-xl p-5 hover:border-primary/50 transition-colors shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-semibold text-lg">{t('orderNumber', { defaultMessage: 'Order #' })}{order.id.slice(-6)}</span>
                <Badge variant="outline" className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('placedOn', { defaultMessage: 'Placed on ' })}{format(new Date(order.createdAt), 'MMM dd, yyyy')}
              </p>
            </div>
            
            <div className="flex items-center justify-between sm:flex-col sm:items-end sm:justify-center gap-2">
              <span className="font-bold text-lg">{formatPrice(order.total)}</span>
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  {t('viewDetails', { defaultMessage: 'View Details' })}
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
