'use client';

import { useState } from 'react';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { format } from 'date-fns';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Search } from 'lucide-react';
import { OrderStatus } from '@/types/order';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { Pagination } from '@/components/shared/Pagination';
import { useTranslations } from 'next-intl';

export function AdminOrdersClient() {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('admin.orders');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Very simple debounce for search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    const timer = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  };

  const { data, isLoading, isError } = useAdminOrders({
    page,
    limit: 10,
    status: status === 'ALL' ? undefined : status,
    search: debouncedSearch || undefined,
  });

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
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card p-4 rounded-xl border shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rtl:end-3 rtl:start-auto" />
          <Input 
            placeholder={t('searchPlaceholder', { defaultMessage: 'Search by order ID or customer...' })} 
            value={search}
            onChange={handleSearchChange}
            className="ps-9"
          />
        </div>
        
        <Select value={status} onValueChange={(val) => { if(val) { setStatus(val); setPage(1); } }}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={t('filterStatus', { defaultMessage: 'Filter by status' })} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t('status.all', { defaultMessage: 'All Statuses' })}</SelectItem>
            <SelectItem value="PENDING">{t('status.pending', { defaultMessage: 'Pending' })}</SelectItem>
            <SelectItem value="PROCESSING">{t('status.processing', { defaultMessage: 'Processing' })}</SelectItem>
            <SelectItem value="SHIPPED">{t('status.shipped', { defaultMessage: 'Shipped' })}</SelectItem>
            <SelectItem value="DELIVERED">{t('status.delivered', { defaultMessage: 'Delivered' })}</SelectItem>
            <SelectItem value="CANCELLED">{t('status.cancelled', { defaultMessage: 'Cancelled' })}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm text-start">
            <TableHeader className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <TableRow>
                <TableHead className="px-6 py-4">{t('table.orderId', { defaultMessage: 'Order ID' })}</TableHead>
                <TableHead className="px-6 py-4">{t('table.date', { defaultMessage: 'Date' })}</TableHead>
                <TableHead className="px-6 py-4">{t('table.customer', { defaultMessage: 'Customer' })}</TableHead>
                <TableHead className="px-6 py-4">{t('table.total', { defaultMessage: 'Total' })}</TableHead>
                <TableHead className="px-6 py-4">{t('table.status', { defaultMessage: 'Status' })}</TableHead>
                <TableHead className="px-6 py-4 text-center">{t('table.actions', { defaultMessage: 'Actions' })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6} className="px-6 py-4">
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError || !data?.data?.length ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    {t('noOrdersFound', { defaultMessage: 'No orders found.' })}
                  </TableCell>
                </TableRow>
              ) : (
                data.data.map((order) => (
                  <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="px-6 py-4 font-medium">#{order.id.slice(-6)}</TableCell>
                    <TableCell className="px-6 py-4">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {/* Normally userId would be populated with user details, mock mapping here */}
                      {order.userId === 'usr_1' ? 'John Doe' : `User ${order.userId.slice(-4)}`}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-semibold">
                      {formatPrice(order.total)}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" /> {t('table.view', { defaultMessage: 'View' })}
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t bg-muted/20">
            <span className="text-sm text-muted-foreground">
              {t('pageInfo', { defaultMessage: 'Page {page} of {totalPages}', page: data.page, totalPages: data.totalPages })}
            </span>
            <Pagination 
              page={data.page} 
              totalPages={data.totalPages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
