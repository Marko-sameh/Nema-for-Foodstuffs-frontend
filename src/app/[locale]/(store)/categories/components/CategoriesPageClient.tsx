'use client';

import { useTranslations } from 'next-intl';
import { useCategoriesList } from '../hooks/useCategories';
import { CategoryCard } from './CategoryCard';
import { PageLoading } from '@/components/shared/LoadingState';
import { EmptyState } from '@/components/shared/EmptyState';
import { PackageX } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';

export function CategoriesPageClient() {
  const t = useTranslations('categories');
  const tCommon = useTranslations('common');
  const { data, isLoading, isError } = useCategoriesList();

  if (isLoading) return <PageLoading />;

  const categories = data?.data || [];

  if (isError) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12">
        <EmptyState
          icon={<PackageX className="w-12 h-12" />}
          title={t('error.title', { defaultMessage: 'Error loading categories' })}
          description={t('error.description', { defaultMessage: 'There was a problem loading the categories. Please try again later.' })}
        />
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12">
        <EmptyState
          icon={<PackageX className="w-12 h-12" />}
          title={t('empty.title', { defaultMessage: 'No categories found' })}
          description={t('empty.description', { defaultMessage: "We couldn't find any categories at this time." })}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <PageHeader 
        eyebrow={t('eyebrow', { defaultMessage: 'Shop by category' })}
        title={tCommon('nav.categories', { defaultMessage: 'Categories' })}
        description={t('subtitle', { defaultMessage: "Browse our wide selection of product categories to find exactly what you're looking for." })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category as any} />
        ))}
      </div>
    </div>
  );
}
