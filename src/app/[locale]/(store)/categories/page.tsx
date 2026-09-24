import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CategoriesPageClient } from './components/CategoriesPageClient';
import { buildMetadata } from '@/lib/seo';

interface CategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'categories' });
  return buildMetadata({
    locale,
    path: '/categories',
    title: t('seo.title', { defaultMessage: 'Categories' }),
    description: t('seo.description', { defaultMessage: 'Explore all product categories available in our store.' }),
  });
}

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
