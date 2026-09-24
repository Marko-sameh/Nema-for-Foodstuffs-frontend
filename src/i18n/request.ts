import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const namespaces = [
  'common',
  'products',
  'cart',
  'checkout',
  'orders',
  'auth',
  'account',
  'admin',
  'addresses',
  'categories',
  'home',
  'search',
  'wishlist',
  'about',
  'contact'
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  // Load all namespaces for the locale
  const entries = await Promise.all(
    namespaces.map(async (ns) => {
      const mod = await import(`../messages/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    })
  );

  const messages = Object.fromEntries(entries);

  return {
    locale,
    messages
  };
});
