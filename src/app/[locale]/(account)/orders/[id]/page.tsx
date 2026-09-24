import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { OrderDetailClient } from '../components/OrderDetailClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface OrderDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'orders' });
  return buildPrivateMetadata(`${t('title', { defaultMessage: 'My Orders' })} #${id}`);
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  return <OrderDetailClient id={id} />;
}
