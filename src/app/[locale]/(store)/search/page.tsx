import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { SearchPageClient } from './components/SearchPageClient';
import { buildMetadata } from '@/lib/seo';

interface SearchPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SearchPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'products' });
  return buildMetadata({
    locale,
    path: '/search',
    title: t('search', { defaultMessage: 'Search Results' }),
    description: t('seo.searchDescription', { defaultMessage: 'Search for products across our full catalog.' }),
    noIndex: true,
  });
}

export default async function SearchPage() {
  const t = await getTranslations('products');
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('search', { defaultMessage: 'Search Results' })}</h1>
      <SearchPageClient />
    </div>
  );
}
