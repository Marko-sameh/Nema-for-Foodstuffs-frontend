import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number, locale: string = 'ar'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatWeight(grams: number, locale: string = 'en'): string {
  const kgUnit = locale === 'ar' ? 'كجم' : 'kg';
  const gUnit = locale === 'ar' ? 'جم' : 'g';
  if (grams >= 1000) {
    const kg = grams / 1000;
    const kgValue = kg % 1 === 0 ? kg.toString() : kg.toFixed(1);
    return `${kgValue}${kgUnit}`;
  }
  return `${grams}${gUnit}`;
}

export function getVariantPrice(pricePerKg: number | undefined, grams: number): number {
  if (!pricePerKg) return 0;
  return (pricePerKg / 1000) * grams;
}

export function getStockStatus(stockInGrams: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (stockInGrams <= 0) return 'out_of_stock';
  if (stockInGrams <= 1000) return 'low_stock'; // less than 1kg is low stock
  return 'in_stock';
}

export function formatDate(
  date: string | number | Date,
  locale: string = 'ar',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', options).format(
    new Date(date)
  );
}

