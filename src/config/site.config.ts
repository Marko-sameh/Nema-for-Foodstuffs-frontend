export const siteConfig = {
  name: {
    ar: 'نعمة للمواد الغذائية',
    en: "Ne'ma for Foodstuffs",
  },
  description: {
    ar: 'أجود أنواع المواد الغذائية الطازجة',
    en: 'Premium quality fresh foodstuffs',
  },
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1',
  locales: ['ar', 'en'] as const,
  defaultLocale: 'ar' as const,
  navLinks: [
    { href: '/', label: 'nav.home' },
    { href: '/products', label: 'nav.products' },
    { href: '/categories', label: 'nav.categories' },
  ],
  adminNavLinks: [
    { href: '/admin/dashboard', label: 'nav.dashboard' },
    { href: '/admin/products', label: 'nav.products' },
    { href: '/admin/orders', label: 'nav.orders' },
  ]
};

export type SiteConfig = typeof siteConfig;
