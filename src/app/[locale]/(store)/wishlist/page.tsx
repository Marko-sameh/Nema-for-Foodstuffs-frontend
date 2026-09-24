import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { WishlistClient } from './components/WishlistClient';
import { buildMetadata } from '@/lib/seo';

interface WishlistPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WishlistPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  return buildMetadata({
    locale,
    path: '/wishlist',
    title: t('nav.wishlist', { defaultMessage: 'Wishlist' }),
    description: t('seo.wishlistDescription', { defaultMessage: 'View the products you have saved for later.' }),
    noIndex: true,
  });
}

import { Heart } from 'lucide-react';

export default async function WishlistPage() {
  const t = await getTranslations('common');
  return (
    <div className="min-h-screen bg-muted/10">
      {/* Page Header */}
      <div className="bg-background border-b border-border/40 shadow-sm relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="container mx-auto px-4 py-10 md:py-14 relative z-10">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/20">
              <Heart className="w-8 h-8 fill-primary/20" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground mb-1.5">
                {t('nav.wishlist', { defaultMessage: 'Wishlist' })}
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {t('seo.wishlistDescription', { defaultMessage: 'View the products you have saved for later.' })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <WishlistClient />
      </div>
    </div>
  );
}
