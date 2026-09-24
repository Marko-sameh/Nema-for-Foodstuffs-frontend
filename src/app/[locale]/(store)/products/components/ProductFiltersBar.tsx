'use client';

import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { ProductFilters } from '../types/product.types';

interface ProductFiltersBarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  onReset: () => void;
}

export function ProductFiltersBar({ filters, onChange, onReset }: ProductFiltersBarProps) {
  const t = useTranslations('products');
  const [searchInput, setSearchInput] = useState(filters.search ?? '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    onChange({ ...filters, search: debouncedSearch || undefined });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={t('searchPlaceholder', { defaultMessage: 'Search products...' })}
          className="ps-10"
        />
      </div>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onReset} className="gap-2">
          <X className="h-4 w-4" />
          {t('clearFilters', { defaultMessage: 'Clear Filters' })}
        </Button>
      )}
    </div>
  );
}
