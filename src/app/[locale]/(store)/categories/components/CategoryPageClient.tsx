'use client';

import { useState } from 'react';
import { useCategoryDetail } from '../hooks/useCategories';
import { ProductList } from '../../products/components/ProductList';
import { ProductFiltersBar } from '../../products/components/ProductFiltersBar';
import { ProductSortSelect } from '../../products/components/ProductSortSelect';
import { ProductFilters } from '../../products/types/product.types';
import { useBrands } from '../../products/hooks/useBrands';
import { GlobalFilter, FilterConfig } from '@/components/shared/GlobalFilter';
import { PageLoading } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

import { useTranslations } from 'next-intl';
import { useLocalizedName, useLocalizedDescription } from '@/lib/i18n-content';

interface CategoryPageClientProps {
  slug: string;
}

export function CategoryPageClient({ slug }: CategoryPageClientProps) {
  const t = useTranslations('categories');
  const tp = useTranslations('products');
  const { data: categoryData, isLoading, isError } = useCategoryDetail(slug);
  const [filters, setFilters] = useState<ProductFilters>({ category: slug });
  const brands = useBrands();
  const category = categoryData?.data;
  const categoryName = useLocalizedName(category ?? {});
  const categoryDescription = useLocalizedDescription(category ?? {});

  if (isLoading) return <PageLoading />;

  if (isError || !category) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-16">
        <EmptyState
          icon={<PackageX className="h-12 w-12" />}
          title={t('notFound.title', { defaultMessage: 'Category not found' })}
          description={t('notFound.description', { defaultMessage: 'The category you are looking for does not exist or has been removed.' })}
          action={<Button onClick={() => window.history.back()}>{t('notFound.goBack', { defaultMessage: 'Go Back' })}</Button>}
        />
      </div>
    );
  }

  // Ensure category slug is always locked in the filter
  const activeFilters = { ...filters, category: slug };

  const filterSchema: FilterConfig[] = [
    ...(brands.length > 0
      ? [{
          id: 'brands',
          title: tp('filters.brands', { defaultMessage: 'Brands' }),
          type: 'checkbox' as const,
          options: brands.map((b) => ({ label: b, value: b })),
        }]
      : []),
    {
      id: 'price',
      title: tp('filters.priceRange', { defaultMessage: 'Price Range' }),
      type: 'range',
      min: 0,
      max: 500,
      step: 10,
      rangeIds: ['minPrice', 'maxPrice'],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      {/* Category Header */}
      <div className="mb-12 flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] bg-accent p-8 md:flex-row">
        {category.imageUrl && (
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-4 border-card sm:h-36 sm:w-36">
            <Image src={category.imageUrl} alt={categoryName} fill sizes="144px" className="object-cover" />
          </div>
        )}

        <div className="text-center md:text-start">
          <span className="eyebrow">{t('eyebrow', { defaultMessage: 'Category' })}</span>
          <h1 className="display-lg mt-2 text-foreground">{categoryName}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {categoryDescription || t('categorySubtitle', { name: categoryName, defaultMessage: 'Browse all products inside the {name} category. Use filters to narrow down your search.' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="hidden space-y-6 lg:block">
          <div className="sticky top-32 rounded-[1.75rem] border border-border bg-card p-6">
            <h3 className="mb-6 font-display text-lg text-foreground">
              {t('filters.title', { defaultMessage: 'Filters' })}
            </h3>
            <GlobalFilter
              schema={filterSchema}
              values={activeFilters as Record<string, any>}
              onChange={(newValues) => setFilters({ ...(newValues as ProductFilters), category: slug })}
            />
            <Button
              variant="ghost"
              onClick={() => setFilters({ category: slug })}
              className="mt-6 w-full rounded-full text-sm font-semibold"
            >
              {tp('clearFilters', { defaultMessage: 'Clear Filters' })}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 lg:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-[220px] flex-1">
              <ProductFiltersBar
                filters={activeFilters}
                onChange={(newFilters) => setFilters({ ...newFilters, category: slug })}
                onReset={() => setFilters({ category: slug })}
              />
            </div>
            <ProductSortSelect
              value={filters.sort}
              onChange={(sort) => setFilters((prev) => ({ ...prev, sort, category: slug }))}
            />
          </div>
          <ProductList filters={activeFilters} limit={12} />
        </div>
      </div>
    </div>
  );
}
