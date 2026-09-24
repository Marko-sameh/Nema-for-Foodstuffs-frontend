import type { Metadata } from 'next';
import { ProductDetailClient } from '../components/ProductDetailClient';
import { ProductsAPI } from '../domain/product.api';
import { buildMetadata } from '@/lib/seo';
import { JsonLd } from '@/components/shared/JsonLd';
import { siteConfig } from '@/config/site.config';
import { getLocalizedName, getLocalizedDescription } from '@/lib/i18n-content';

interface ProductDetailPageProps {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  try {
    const product = await ProductsAPI.fetchBySlug(slug);
    const name = getLocalizedName(product, locale);
    const description = getLocalizedDescription(product, locale) ?? `${name} — ${siteConfig.name[locale as 'ar' | 'en'] ?? siteConfig.name.en}`;
    return buildMetadata({
      locale,
      path: `/products/${slug}`,
      title: name,
      description,
      image: product.thumbnailUrl,
    });
  } catch {
    return buildMetadata({
      locale,
      path: `/products/${slug}`,
      title: siteConfig.name[locale as 'ar' | 'en'] ?? siteConfig.name.en,
      description: siteConfig.description[locale as 'ar' | 'en'] ?? siteConfig.description.en,
    });
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  let product = null;
  try {
    product = await ProductsAPI.fetchBySlug(slug);
  } catch {
    product = null;
  }

  return (
    <>
      {product && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description ?? product.name,
            image: product.thumbnailUrl ? [product.thumbnailUrl] : undefined,
            sku: product.sku,
            brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'EGP',
              price: product.unitType === 'PIECE' ? product.fixedPrice ?? 0 : product.pricePerKg ?? 0,
              availability:
                product.stockInGrams > 0
                  ? 'https://schema.org/InStock'
                  : 'https://schema.org/OutOfStock',
              url: `${siteConfig.baseUrl}/products/${product.slug}`,
            },
          }}
        />
      )}
      <ProductDetailClient slug={slug} />
    </>
  );
}
