'use client';

import { useState } from 'react';
import { useRevenueAnalytics, useTopProducts } from '../hooks/useAnalytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocaleFormat } from '@/lib/use-locale-format';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

const RevenueChart = dynamic(() => import('./RevenueChart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-xl" />,
});

export function AnalyticsClient() {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('admin.analytics');
  const [days, setDays] = useState('30');
  const { data: revenueData, isLoading: isLoadingRevenue } = useRevenueAnalytics(parseInt(days));
  const { data: topProductsData, isLoading: isLoadingProducts } = useTopProducts();

  const revenue = revenueData?.data || [];
  const topProducts = topProductsData?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <Select value={days} onValueChange={(val) => val && setDays(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('selectTimeframe', { defaultMessage: 'Select timeframe' })} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">{t('lastDays', { defaultMessage: 'Last 7 days', count: 7 })}</SelectItem>
            <SelectItem value="30">{t('lastDays', { defaultMessage: 'Last 30 days', count: 30 })}</SelectItem>
            <SelectItem value="90">{t('lastDays', { defaultMessage: 'Last 90 days', count: 90 })}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t('revenueOverview', { defaultMessage: 'Revenue Overview' })}</CardTitle>
            <CardDescription>{t('dailyRevenueDesc', { defaultMessage: 'Daily revenue for the last {days} days', days })}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRevenue ? (
              <Skeleton className="h-[400px] w-full rounded-xl" />
            ) : revenue.length === 0 ? (
              <div className="h-[400px] flex items-center justify-center text-muted-foreground border rounded-xl bg-muted/20">
                {t('noRevenueData', { defaultMessage: 'No revenue data available' })}
              </div>
            ) : (
              <div className="h-[400px] w-full">
                <RevenueChart data={revenue} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>{t('topSellingProducts', { defaultMessage: 'Top Selling Products' })}</CardTitle>
            <CardDescription>{t('topProductsDesc', { defaultMessage: 'Highest revenue generating products' })}</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingProducts ? (
              <Skeleton className="h-[300px] w-full rounded-xl" />
            ) : topProducts.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground border rounded-xl bg-muted/20">
                {t('noProductData', { defaultMessage: 'No product data available' })}
              </div>
            ) : (
              <div className="space-y-6">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm leading-none">{product.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{product.totalSold} {t('unitsSold', { defaultMessage: 'units sold' })}</p>
                      </div>
                    </div>
                    <div className="font-semibold text-sm">
                      {formatPrice(product.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
