'use client';

import { useDashboardStats, useRecentOrders } from '../hooks/useDashboardStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, Users, ShoppingBag, Package, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/i18n/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslations } from 'next-intl';

export function DashboardClient() {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('admin.dashboardPage');
  const { data: statsData, isLoading: isLoadingStats } = useDashboardStats();
  const { data: ordersData, isLoading: isLoadingOrders } = useRecentOrders();

  if (isLoadingStats || isLoadingOrders) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  const stats = statsData?.data;
  const recentOrders = ordersData?.data || [];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('totalRevenue', { defaultMessage: 'Total Revenue' })}</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
              <p className={`text-xs mt-1 flex items-center ${stats.revenueChangePercent >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                {stats.revenueChangePercent >= 0 ? <ArrowUpRight className="w-3 h-3 me-1" /> : <ArrowDownRight className="w-3 h-3 me-1" />}
                {Math.abs(stats.revenueChangePercent)}{t('fromLastMonth', { defaultMessage: '% from last month' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('orders', { defaultMessage: 'Orders' })}</CardTitle>
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.totalOrders}</div>
              <p className={`text-xs mt-1 flex items-center ${stats.ordersChangePercent >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                {stats.ordersChangePercent >= 0 ? <ArrowUpRight className="w-3 h-3 me-1" /> : <ArrowDownRight className="w-3 h-3 me-1" />}
                {Math.abs(stats.ordersChangePercent)}{t('fromLastMonth', { defaultMessage: '% from last month' })}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('customers', { defaultMessage: 'Customers' })}</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('activeUsers', { defaultMessage: 'Active users' })}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{t('products', { defaultMessage: 'Products' })}</CardTitle>
              <Package className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground mt-1">{t('inStock', { defaultMessage: 'In stock' })}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Orders Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t('recentOrders', { defaultMessage: 'Recent Orders' })}</CardTitle>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">
            {t('viewAll', { defaultMessage: 'View All' })}
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow className="border-b text-muted-foreground">
                  <TableHead className="py-3 text-start font-medium">{t('table.orderId', { defaultMessage: 'Order ID' })}</TableHead>
                  <TableHead className="py-3 text-start font-medium">{t('table.date', { defaultMessage: 'Date' })}</TableHead>
                  <TableHead className="py-3 text-start font-medium">{t('table.status', { defaultMessage: 'Status' })}</TableHead>
                  <TableHead className="py-3 text-end font-medium">{t('table.amount', { defaultMessage: 'Amount' })}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                      {t('noRecentOrders', { defaultMessage: 'No recent orders found.' })}
                    </TableCell>
                  </TableRow>
                ) : (
                  recentOrders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="py-3 font-medium">#{order.id.slice(-6)}</TableCell>
                      <TableCell className="py-3 text-muted-foreground">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-end font-medium">{formatPrice(order.total)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
