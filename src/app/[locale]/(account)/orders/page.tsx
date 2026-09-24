import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { OrderListClient } from './components/OrderListClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface OrdersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: OrdersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'orders' });
  return buildPrivateMetadata(t('title', { defaultMessage: 'My Orders' }));
}

export default async function OrdersPage() {
  const t = await getTranslations('orders');
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('title', { defaultMessage: 'My Orders' })}</h2>
      <OrderListClient />
    </div>
  );
}
