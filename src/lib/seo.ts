import type { Metadata } from 'next';
import { siteConfig } from '@/config/site.config';

type Locale = 'ar' | 'en';

interface BuildMetadataParams {
  locale: string;
  /** Path without locale prefix, e.g. "/products" or "/products/my-slug" */
  path: string;
  title: string;
  description: string;
  /** Absolute or relative image URL used for Open Graph / Twitter cards */
  image?: string;
  /** Set to prevent indexing (admin/account routes) */
  noIndex?: boolean;
}

function localizedPath(locale: string, path: string): string {
  const normalized = path === '/' ? '' : path;
  return `/${locale}${normalized}`;
}

/**
 * Builds a full Metadata object with canonical + hreflang alternates + OG/Twitter tags.
 * Use inside `generateMetadata` for any public route.
 */
export function buildMetadata({
  locale,
  path,
  title,
  description,
  image,
  noIndex,
}: BuildMetadataParams): Metadata {
  const baseUrl = siteConfig.baseUrl;
  const canonicalUrl = `${baseUrl}${localizedPath(locale, path)}`;
  const languages: Record<string, string> = {};
  for (const l of siteConfig.locales as readonly Locale[]) {
    languages[l] = `${baseUrl}${localizedPath(l, path)}`;
  }
  languages['x-default'] = `${baseUrl}${localizedPath(siteConfig.defaultLocale, path)}`;

  const ogImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/images/hero-banner.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name[locale as Locale] ?? siteConfig.name.en,
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      images: [{ url: ogImage }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** Shorthand for private (admin/account) routes: no indexing, still localized title. */
export function buildPrivateMetadata(title: string): Metadata {
  return {
    title,
    robots: { index: false, follow: false },
  };
}
