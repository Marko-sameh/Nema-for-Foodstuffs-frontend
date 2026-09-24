'use client';

import { useAdminOrderDetail, useUpdateOrderStatus } from '../hooks/useAdminOrders';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Save } from 'lucide-react';
import { OrderStatus } from '@/types/order';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface AdminOrderDetailClientProps {
  id: string;
}

export function AdminOrderDetailClient({ id }: AdminOrderDetailClientProps) {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('admin.orders');
  const { data: response, isLoading, isError } = useAdminOrderDetail(id);
  const updateMutation = useUpdateOrderStatus();
  
  const [status, setStatus] = useState<OrderStatus>('PENDING');

  const order = response;

  // Initialize status state when data loads
  useEffect(() => {
    if (order) {
      setStatus(order.status);
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">{t('orderNotFound', { defaultMessage: 'Order not found' })}</h3>
        <Link href="/admin/orders">
          <Button variant="link" className="mt-4">{t('returnToOrders', { defaultMessage: 'Return to Orders' })}</Button>
        </Link>
      </div>
    );
  }

  const handleUpdateStatus = () => {
    updateMutation.mutate({ id, status });
  };

  const isStatusChanged = status !== order.status;

  const getStatusColor = (s: OrderStatus) => {
    switch (s) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Breadcrumb 
          items={[
            { label: t('nav.admin', { defaultMessage: 'Admin' }), href: '/admin' },
            { label: t('nav.orders', { defaultMessage: 'Orders' }), href: '/admin/orders' },
            { label: `${t('orderNumber', { defaultMessage: 'Order #' })}${order.id.slice(-6)}` }
          ]} 
        />

        {/* Status Update Actions */}
        <div className="flex items-center gap-3">
          <Select value={status} onValueChange={(val: string | null) => { if(val) setStatus(val as OrderStatus); }}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">{t('status.pending', { defaultMessage: 'Pending' })}</SelectItem>
              <SelectItem value="CONFIRMED">{t('status.confirmed', { defaultMessage: 'Confirmed' })}</SelectItem>
              <SelectItem value="PROCESSING">{t('status.processing', { defaultMessage: 'Processing' })}</SelectItem>
              <SelectItem value="SHIPPED">{t('status.shipped', { defaultMessage: 'Shipped' })}</SelectItem>
              <SelectItem value="DELIVERED">{t('status.delivered', { defaultMessage: 'Delivered' })}</SelectItem>
              <SelectItem value="CANCELLED">{t('status.cancelled', { defaultMessage: 'Cancelled' })}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleUpdateStatus} 
            disabled={!isStatusChanged || updateMutation.isPending}
            className="gap-2"
          >
            <Save className="w-4 h-4" /> 
            {updateMutation.isPending ? t('updating', { defaultMessage: 'Updating...' }) : t('updateStatus', { defaultMessage: 'Update Status' })}
          </Button>
        </div>
      </div>
      
      {/* Header Info */}
      <div className="bg-card border rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{t('orderNumber', { defaultMessage: 'Order #' })}{order.id.slice(-6)}</h2>
            <Badge variant="outline" className={`${getStatusColor(order.status)} text-sm px-2 py-0.5`}>
              {order.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {t('placedOn', { defaultMessage: 'Placed on {date}', date: format(new Date(order.createdAt), 'MMMM dd, yyyy a\t h:mm a') })}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div>
            <span className="text-muted-foreground block mb-1">{t('customerId', { defaultMessage: 'Customer ID' })}</span>
            <span className="font-medium">{order.userId}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">{t('paymentMethod', { defaultMessage: 'Payment Method' })}</span>
            <span className="font-medium">{order.paymentMethod}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-1">{t('paymentStatus', { defaultMessage: 'Payment Status' })}</span>
            <Badge variant="secondary" className="font-medium">{order.paymentStatus}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold">{t('orderItems', { defaultMessage: 'Order Items' })}</h3>
          <div className="bg-card border rounded-xl divide-y overflow-hidden shadow-sm">
            {order.items?.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between gap-4 hover:bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center font-bold text-muted-foreground shrink-0 border">
                    {item.productName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.productName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.price)} × {item.quantity} {item.unitType === 'WEIGHT' ? 'kg' : 'units'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {item.productId}</p>
                  </div>
                </div>
                <div className="font-bold text-lg text-end shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
            {!order.items?.length && (
              <div className="p-8 text-center text-muted-foreground">{t('noItems', { defaultMessage: 'No items found for this order.' })}</div>
            )}
          </div>
        </div>

        {/* Order Summary & Delivery */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('summary', { defaultMessage: 'Summary' })}</h3>
            <div className="bg-card border rounded-xl p-6 space-y-4 shadow-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>{t('subtotal', { defaultMessage: 'Subtotal' })}</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t('deliveryFee', { defaultMessage: 'Delivery Fee' })}</span>
                <span>{formatPrice(order.deliveryFee)}</span>
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
          
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">{t('deliveryAddress', { defaultMessage: 'Delivery Address' })}</h3>
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <p className="font-mono text-sm text-muted-foreground break-all">
                {t('addressId', { defaultMessage: 'Address ID: {id}', id: order.addressId })}
              </p>
              <Button variant="outline" className="w-full mt-4" size="sm">
                {t('viewFullAddress', { defaultMessage: 'View Full Address Details' })}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
