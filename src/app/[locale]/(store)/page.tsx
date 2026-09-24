import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HomePageClient } from './components/home/HomePageClient';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/shared/JsonLd';
import { siteConfig } from '@/config/site.config';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return buildMetadata({
    locale,
    path: '/',
    title: t('seo.homeTitle', { defaultMessage: siteConfig.name[locale as 'ar' | 'en'] ?? siteConfig.name.en }),
    description: t('seo.homeDescription', { defaultMessage: siteConfig.description[locale as 'ar' | 'en'] ?? siteConfig.description.en }),
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteConfig.name[locale as 'ar' | 'en'] ?? siteConfig.name.en,
          url: siteConfig.baseUrl,
          logo: `${siteConfig.baseUrl}/images/hero-banner.png`,
        }}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: siteConfig.name[locale as 'ar' | 'en'] ?? siteConfig.name.en,
          url: `${siteConfig.baseUrl}/${locale}`,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteConfig.baseUrl}/${locale}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      <HomePageClient />
    </>
  );
}
