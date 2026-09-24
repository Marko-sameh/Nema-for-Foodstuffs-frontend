import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { CartPageClient } from './components/CartPageClient';
import { buildMetadata } from '@/lib/seo';

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CartPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return buildMetadata({
    locale,
    path: '/cart',
    title: t('nav.cart', { defaultMessage: 'Cart' }),
    description: t('seo.cartDescription', { defaultMessage: 'Review the items in your shopping cart before checking out.' }),
    noIndex: true,
  });
}

export default async function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CartPageClient />
    </div>
  );
}
