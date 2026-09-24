import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminSettingsClient } from './components/AdminSettingsClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminSettingsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminSettingsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('nav.settings', { defaultMessage: 'Settings' }));
}

export default async function AdminSettingsPage() {
  return <AdminSettingsClient />;
}
