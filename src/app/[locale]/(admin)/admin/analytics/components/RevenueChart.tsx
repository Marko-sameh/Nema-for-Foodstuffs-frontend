'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { useTranslations } from 'next-intl';

interface RevenueChartProps {
  data: Array<{ date: string; revenue: number }>;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const { formatPrice } = useLocaleFormat();
  const t = useTranslations('admin.analytics');
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            const date = new Date(value);
            return `${date.getMonth() + 1}/${date.getDate()}`;
          }}
        />
        <YAxis tickFormatter={(value) => formatPrice(Number(value) || 0)} />
        <Tooltip
          formatter={(value: any) => [formatPrice(Number(value) || 0), t('revenue', { defaultMessage: 'Revenue' })]}
          labelFormatter={(label) => new Date(label).toLocaleDateString()}
        />
        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
