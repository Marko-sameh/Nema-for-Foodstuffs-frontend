import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { routing } from '@/i18n/routing';

// Negotiate locale from Accept-Language and redirect to it.
export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';

  const locales: readonly string[] = routing?.locales ?? ['ar', 'en'];
  const defaultLocale = routing?.defaultLocale ?? 'ar';

  const preferred = acceptLanguage
    .split(',')
    .map((part) => part.split(';')[0]?.trim().toLowerCase())
    .find((lang) => lang && locales.some((l) => lang.startsWith(l)));

  const matched = preferred ? locales.find((l) => preferred.startsWith(l)) : undefined;

  redirect(`/${matched ?? defaultLocale}`);
}
