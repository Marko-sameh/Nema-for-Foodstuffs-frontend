import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminCreateProductClient } from '../components/AdminCreateProductClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminCreateProductPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminCreateProductPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('products.create', { defaultMessage: 'Create Product' }));
}

export default async function AdminCreateProductPage() {
  return <AdminCreateProductClient />;
}
