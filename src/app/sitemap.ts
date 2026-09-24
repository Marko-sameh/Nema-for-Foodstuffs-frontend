import type { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site.config';

const LOCALES = siteConfig.locales;

interface ApiListResponse<T> {
  data?: { data?: T[] } | T[];
}

async function safeFetchList(path: string): Promise<{ slug: string; updatedAt?: string }[]> {
  try {
    const res = await fetch(`${siteConfig.apiUrl}${path}`, {
      // Keep the build from hanging forever if the API is unreachable.
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const json: ApiListResponse<{ slug: string; updatedAt?: string }> = await res.json();
    const list = Array.isArray(json.data) ? json.data : json.data?.data ?? [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function withLocales(path: string, lastModified?: Date): MetadataRoute.Sitemap {
  return LOCALES.map((locale) => ({
    url: `${siteConfig.baseUrl}/${locale}${path}`,
    lastModified,
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((l) => [l, `${siteConfig.baseUrl}/${l}${path}`])
      ),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ['', '/products', '/categories', '/about', '/contact', '/search', '/cart', '/wishlist', '/login', '/register']
    .flatMap((path) => withLocales(path));

  const [products, categories] = await Promise.all([
    safeFetchList('/products?limit=1000'),
    safeFetchList('/categories?limit=1000'),
  ]);

  const productRoutes = products.flatMap((p) =>
    withLocales(`/products/${p.slug}`, p.updatedAt ? new Date(p.updatedAt) : undefined)
  );
  const categoryRoutes = categories.flatMap((c) =>
    withLocales(`/categories/${c.slug}`, c.updatedAt ? new Date(c.updatedAt) : undefined)
  );

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
