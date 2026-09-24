import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { WishlistClient } from './components/WishlistClient';
import { buildMetadata } from '@/lib/seo';

interface WishlistPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WishlistPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return buildMetadata({
    locale,
    path: '/wishlist',
    title: t('nav.wishlist', { defaultMessage: 'Wishlist' }),
    description: t('seo.wishlistDescription', { defaultMessage: 'View the products you have saved for later.' }),
    noIndex: true,
  });
}

export default async function WishlistPage() {
  const t = await getTranslations('common');
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('nav.wishlist', { defaultMessage: 'Wishlist' })}</h1>
      <WishlistClient />
    </div>
  );
}
