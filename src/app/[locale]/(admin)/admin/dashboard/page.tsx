import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { DashboardClient } from './components/DashboardClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminDashboardPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminDashboardPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('nav.dashboard', { defaultMessage: 'Dashboard' }));
}

export default async function AdminDashboardPage() {
  const t = await getTranslations('admin');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">
        {t('nav.dashboard', { defaultMessage: 'Dashboard' })}
      </h1>
      <DashboardClient />
    </div>
  );
}
