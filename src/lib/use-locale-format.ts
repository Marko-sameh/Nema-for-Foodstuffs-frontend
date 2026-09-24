'use client';

import { useLocale } from 'next-intl';
import { formatPrice, formatWeight, formatDate } from '@/lib/utils';

/**
 * Client-component hook exposing price/weight/date formatters bound to the
 * currently active locale, so call sites don't need to thread the locale
 * through manually.
 */
export function useLocaleFormat() {
  const locale = useLocale();
  return {
    locale,
    formatPrice: (amount: number) => formatPrice(amount, locale),
    formatWeight: (grams: number) => formatWeight(grams, locale),
    formatDate: (date: string | number | Date, options?: Intl.DateTimeFormatOptions) =>
      formatDate(date, locale, options),
  };
}
