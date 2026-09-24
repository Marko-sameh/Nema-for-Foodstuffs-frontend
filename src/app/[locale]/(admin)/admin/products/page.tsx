import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminProductsClient } from './components/AdminProductsClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('nav.products', { defaultMessage: 'Products' }));
}

export default async function AdminProductsPage() {
  return <AdminProductsClient />;
}
