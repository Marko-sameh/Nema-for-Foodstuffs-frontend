'use client';

import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductSort } from '../types/product.types';

interface ProductSortSelectProps {
  value?: ProductSort;
  onChange: (value: ProductSort) => void;
}

export function ProductSortSelect({ value, onChange }: ProductSortSelectProps) {
  const t = useTranslations('products');

  const options: { value: ProductSort; label: string }[] = [
    { value: 'newest', label: t('sort.newest', { defaultMessage: 'Newest first' }) },
    { value: 'price_asc', label: t('sort.priceAsc', { defaultMessage: 'Price: low to high' }) },
    { value: 'price_desc', label: t('sort.priceDesc', { defaultMessage: 'Price: high to low' }) },
    { value: 'name', label: t('sort.name', { defaultMessage: 'Name A–Z' }) },
  ];

  return (
    <Select value={value ?? 'newest'} onValueChange={(v) => onChange(v as ProductSort)}>
      <SelectTrigger className="h-10 w-[200px] rounded-full border-border bg-card text-sm font-medium">
        <SelectValue placeholder={t('sort.label', { defaultMessage: 'Sort by' })} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
