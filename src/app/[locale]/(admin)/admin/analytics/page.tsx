import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AnalyticsClient } from './components/AnalyticsClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminAnalyticsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminAnalyticsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('nav.analytics', { defaultMessage: 'Analytics' }));
}

export default async function AdminAnalyticsPage() {
  const t = await getTranslations('admin');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">{t('nav.analytics', { defaultMessage: 'Analytics' })}</h1>
      <AnalyticsClient />
    </div>
  );
}
