import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminOrderDetailClient } from '../components/AdminOrderDetailClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: AdminOrderDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(`${t('nav.orders', { defaultMessage: 'Orders' })} #${id}`);
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  return <AdminOrderDetailClient id={id} />;
}
