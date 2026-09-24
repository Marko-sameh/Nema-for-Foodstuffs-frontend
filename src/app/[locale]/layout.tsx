import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Cairo, Poppins, Playfair_Display } from 'next/font/google';
import '../globals.css'; // Make sure this is correct
import QueryProvider from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';

const cairo = Cairo({ subsets: ['arabic', 'latin'], variable: '--font-cairo' });
const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  style: ['normal', 'italic'],
  weight: ['500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: "Ne'ma for Foodstuffs",
  description: "Premium foodstuffs and groceries delivered directly to your door",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${cairo.variable} ${poppins.variable} ${playfair.variable} antialiased min-h-screen flex flex-col font-sans bg-background text-foreground`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            {children}
            <Toaster position={dir === 'rtl' ? 'bottom-left' : 'bottom-right'} />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
