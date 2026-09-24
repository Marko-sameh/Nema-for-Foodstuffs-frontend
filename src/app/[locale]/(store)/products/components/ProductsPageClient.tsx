'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ProductList } from './ProductList';
import { ProductSortSelect } from './ProductSortSelect';
import { ProductFilters, ProductSort } from '../types/product.types';

import { useCategoriesList } from '../../categories/hooks/useCategories';
import { useBrands } from '../hooks/useBrands';

import { GlobalFilter, FilterConfig } from '@/components/shared/GlobalFilter';

export function ProductsPageClient() {
  const t = useTranslations('products');
  const [filters, setFilters] = useState<ProductFilters>({});
  const { data: categoriesData } = useCategoriesList();
  const brands = useBrands();

  // Transform fetched categories into filter options
  const categoryOptions = categoriesData?.data?.map(cat => ({
    label: cat.name,
    value: cat.slug
  })) || [];

  const filterSchema: FilterConfig[] = [
    {
      id: 'search',
      title: '',
      type: 'search'
    },
    {
      id: 'categories',
      title: t('filters.categories', { defaultMessage: 'Categories' }),
      type: 'checkbox',
      options: categoryOptions
    },
    ...(brands.length > 0
      ? [{
          id: 'brands',
          title: t('filters.brands', { defaultMessage: 'Brands' }),
          type: 'checkbox' as const,
          options: brands.map((b) => ({ label: b, value: b })),
        }]
      : []),
    {
      id: 'price',
      title: t('filters.priceRange', { defaultMessage: 'Price Range' }),
      type: 'range',
      min: 0,
      max: 500,
      step: 10,
      rangeIds: ['minPrice', 'maxPrice']
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <span className="eyebrow">{t('eyebrow', { defaultMessage: 'The full shelf' })}</span>
          <h1 className="display-lg mt-2 text-foreground">{t('title', { defaultMessage: 'All Products' })}</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">
            {t('subtitle', { defaultMessage: 'Browse our complete selection of fresh produce and goods.' })}
          </p>
        </div>
        <ProductSortSelect
          value={filters.sort}
          onChange={(sort) => setFilters((prev) => ({ ...prev, sort }))}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        {/* Sidebar Filters (Desktop) */}
        <div className="hidden space-y-6 lg:block">
          <div className="sticky top-32 rounded-[1.75rem] border border-border bg-card p-6">
            <GlobalFilter
              schema={filterSchema}
              values={filters as Record<string, any>}
              onChange={(newValues) => setFilters(newValues as ProductFilters)}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 lg:col-span-3">
          <ProductList filters={filters} limit={12} />
        </div>
      </div>
    </div>
  );
}
