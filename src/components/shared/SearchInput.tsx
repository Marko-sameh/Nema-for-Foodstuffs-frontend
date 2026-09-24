'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  debounceMs?: number;
  className?: string;
}

/**
 * Debounced search input — use in every listing page (admin + store).
 * Fires onChange only after the user stops typing.
 *
 * @example
 * <SearchInput
 *   placeholder="Search products..."
 *   onChange={(q) => setFilters(f => ({ ...f, search: q }))}
 *   debounceMs={400}
 * />
 */
export function SearchInput({
  placeholder = 'Search...',
  value = '',
  onChange,
  debounceMs = 400,
  className,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, debounceMs);

  useEffect(() => {
    onChange(debounced);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  // Sync external reset (e.g., clear filters)
  useEffect(() => {
    if (value !== local) setLocal(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute start-3 rtl:start-auto rtl:end-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="ps-10 rtl:ps-3 rtl:pe-10"
      />
      {local && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setLocal('')}
          className="absolute end-3 rtl:end-auto rtl:start-3 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-transparent"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
