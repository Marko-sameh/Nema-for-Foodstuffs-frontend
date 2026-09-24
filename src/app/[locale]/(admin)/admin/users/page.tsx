import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AdminUsersClient } from './components/AdminUsersClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AdminUsersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AdminUsersPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'admin' });
  return buildPrivateMetadata(t('nav.users', { defaultMessage: 'Users' }));
}

export default async function AdminUsersPage() {
  const t = await getTranslations('admin');
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('nav.users', { defaultMessage: 'Users' })}</h1>
      <AdminUsersClient />
    </div>
  );
}
