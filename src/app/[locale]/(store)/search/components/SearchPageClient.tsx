'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductList } from '../../products/components/ProductList';
import { ProductFiltersBar } from '../../products/components/ProductFiltersBar';
import { ProductFilters } from '../../products/types/product.types';
import { useTranslations } from 'next-intl';

function SearchPageContent() {
  const t = useTranslations('search');
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [filters, setFilters] = useState<ProductFilters>({ search: initialSearch });

  // Update filters if the URL query parameter changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    setFilters(prev => ({ ...prev, search: q }));
  }, [searchParams]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-card border rounded-xl p-5 sticky top-24">
          <h3 className="font-semibold mb-4 text-lg">{t('filters', { defaultMessage: 'Filters' })}</h3>
          <p className="text-sm text-muted-foreground">{t('moreFiltersSoon', { defaultMessage: 'More filters coming soon.' })}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        <ProductFiltersBar 
          filters={filters} 
          onChange={setFilters} 
          onReset={() => setFilters({})} 
        />
        <ProductList filters={filters} limit={12} />
      </div>
    </div>
  );
}

export function SearchPageClient() {
  const t = useTranslations('search');
  return (
    <Suspense fallback={<div className="h-96 flex items-center justify-center text-muted-foreground">{t('loading', { defaultMessage: 'Loading search...' })}</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
