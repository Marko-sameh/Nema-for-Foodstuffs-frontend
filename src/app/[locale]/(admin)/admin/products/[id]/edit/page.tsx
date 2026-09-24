import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminEditProductClient } from '../../components/AdminEditProductClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminEditProductPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({ params }: AdminEditProductPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('products.edit', { defaultMessage: 'Edit Product' }));
}

export default async function AdminEditProductPage({ params }: AdminEditProductPageProps) {
  const { id } = await params;
  return <AdminEditProductClient productId={id} />;
}
