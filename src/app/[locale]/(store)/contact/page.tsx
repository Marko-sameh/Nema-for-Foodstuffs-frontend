import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo';
import { ContactPageClient } from './components/ContactPageClient';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  return buildMetadata({
    locale,
    path: '/contact',
    title: t('seo.title', { defaultMessage: 'Contact Us' }),
    description: t('seo.description', { defaultMessage: 'Questions about an order, a product or delivery? Reach our team.' }),
  });
}

export default function ContactPage() {
  return <ContactPageClient />;
}
