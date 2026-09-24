import type { Metadata } from 'next';
import { CategoryPageClient } from '../components/CategoryPageClient';
import { buildMetadata } from '@/lib/seo';
import { api } from '@/lib/api';
import { siteConfig } from '@/config/site.config';
import { getLocalizedName, getLocalizedDescription } from '@/lib/i18n-content';

interface CategoryPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

interface CategoryDetail {
  name: string;
  nameAr?: string;
  nameEn?: string;
  description?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  imageUrl?: string;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const category = await api.get<CategoryDetail>(`/categories/${slug}`);
    const name = getLocalizedName(category, locale);
    return buildMetadata({
      locale,
      path: `/categories/${slug}`,
      title: name,
      description: getLocalizedDescription(category, locale) ?? `${name} — ${siteConfig.name[locale as 'ar' | 'en'] ?? siteConfig.name.en}`,
      image: category.imageUrl,
    });
  } catch {
    return buildMetadata({
      locale,
      path: `/categories/${slug}`,
      title: siteConfig.name[locale as 'ar' | 'en'] ?? siteConfig.name.en,
      description: siteConfig.description[locale as 'ar' | 'en'] ?? siteConfig.description.en,
    });
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  return <CategoryPageClient slug={slug} />;
}
