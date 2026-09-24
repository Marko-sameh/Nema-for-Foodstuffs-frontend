import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminOrdersClient } from './components/AdminOrdersClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminOrdersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminOrdersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('nav.orders', { defaultMessage: 'Orders' }));
}

export default async function AdminOrdersPage() {
  const t = await getTranslations('admin');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('nav.orders', { defaultMessage: 'Orders' })}</h1>
      <AdminOrdersClient />
    </div>
  );
}
