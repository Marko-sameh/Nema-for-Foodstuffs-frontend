'use client';

import { Order, OrderStatus } from '@/types/order';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '../types/order.types';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { Link } from '@/i18n/navigation';
import { ChevronRight } from 'lucide-react';

interface OrderStatusBadgeProps { status: Order['status']; }

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}

interface OrderRowProps { order: Order; }

export function OrderRow({ order }: OrderRowProps) {
  const { formatPrice, formatDate } = useLocaleFormat();
  return (
    <Link
      href={`/orders/${order.id}`}
      className="flex items-center justify-between p-4 border rounded-xl hover:border-primary hover:bg-muted/30 transition-all group"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-semibold">#{order.id.slice(-8).toUpperCase()}</span>
          <OrderStatusBadge status={order.status} />
        </div>
        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-bold text-primary">{formatPrice(order.total)}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors rtl:rotate-180" />
      </div>
    </Link>
  );
}
