import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AddressListClient } from './components/AddressListClient';
import { buildPrivateMetadata } from '@/lib/seo';

interface AddressesPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AddressesPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'account' });
  return buildPrivateMetadata(t('nav.addresses', { defaultMessage: 'My Addresses' }));
}

export default async function AddressesPage() {
  const t = await getTranslations('account');
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('nav.addresses', { defaultMessage: 'My Addresses' })}</h2>
      <AddressListClient />
    </div>
  );
}
