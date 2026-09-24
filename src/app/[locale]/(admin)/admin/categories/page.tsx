import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminCategoriesClient } from './components/AdminCategoriesClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminCategoriesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminCategoriesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('nav.categories', { defaultMessage: 'Categories' }));
}

export default async function AdminCategoriesPage() {
  const t = await getTranslations('admin');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('nav.categories', { defaultMessage: 'Categories' })}</h1>
      <AdminCategoriesClient />
    </div>
  );
}
