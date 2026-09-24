import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProductsPageClient } from './components/ProductsPageClient';
import { buildMetadata } from '@/lib/seo';

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProductsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return buildMetadata({
    locale,
    path: '/products',
    title: t('seo.title', { defaultMessage: 'All Products' }),
    description: t('seo.description', { defaultMessage: 'Browse our full range of premium foodstuffs and groceries, sold by weight or piece.' }),
  });
}

export default async function ProductsPage() {
  return <ProductsPageClient />;
}
