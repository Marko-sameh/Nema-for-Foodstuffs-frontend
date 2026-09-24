import { useLocale } from 'next-intl';

export type Locale = 'ar' | 'en';

export interface LocalizedContent {
  name?: string | null;
  nameAr?: string | null;
  nameEn?: string | null;
  description?: string | null;
  descriptionAr?: string | null;
  descriptionEn?: string | null;
}

/**
 * Picks the locale-appropriate `name` field from a backend entity that may
 * carry `nameAr` / `nameEn` (and a generic `name` fallback).
 */
export function getLocalizedName(entity: LocalizedContent, locale: string): string {
  if (locale === 'ar') {
    return entity.nameAr || entity.name || entity.nameEn || '';
  }
  return entity.nameEn || entity.name || entity.nameAr || '';
}

/**
 * Picks the locale-appropriate `description` field from a backend entity
 * that may carry `descriptionAr` / `descriptionEn` (and a generic
 * `description` fallback).
 */
export function getLocalizedDescription(
  entity: LocalizedContent,
  locale: string
): string | undefined {
  const value =
    locale === 'ar'
      ? entity.descriptionAr || entity.description || entity.descriptionEn
      : entity.descriptionEn || entity.description || entity.descriptionAr;
  return value ?? undefined;
}

/** Client-component hook variant of {@link getLocalizedName}. */
export function useLocalizedName(entity: LocalizedContent): string {
  const locale = useLocale();
  return getLocalizedName(entity, locale);
}

/** Client-component hook variant of {@link getLocalizedDescription}. */
export function useLocalizedDescription(entity: LocalizedContent): string | undefined {
  const locale = useLocale();
  return getLocalizedDescription(entity, locale);
}
