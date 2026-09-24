'use client';

import { Header } from '@/components/layouts/Header';
import { Footer } from '@/components/layouts/Footer';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { User, ShoppingBag, MapPin, Heart, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('account');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, router]);

  const links = [
    { href: '/profile', label: t('nav.profile', { defaultMessage: 'Profile' }), icon: User },
    { href: '/orders', label: t('nav.orders', { defaultMessage: 'Orders' }), icon: ShoppingBag },
    { href: '/addresses', label: t('nav.addresses', { defaultMessage: 'Addresses' }), icon: MapPin },
    { href: '/wishlist', label: t('nav.wishlist', { defaultMessage: 'Wishlist' }), icon: Heart },
  ];

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/10">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-muted/10">
          <p className="text-muted-foreground">{tc("misc.redirectingToLogin")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-muted/10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">{t('myAccount', { defaultMessage: 'My Account' })}</h1>
          
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 flex-shrink-0">
              <nav className="flex flex-col gap-1 bg-card rounded-lg border p-4">
                {links.map((link) => {
                  const isActive = pathname.startsWith(link.href);
                  const Icon = link.icon;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
                
                <hr className="my-2" />
                
                <Button
                  variant="ghost"
                  onClick={() => logout()}
                  className="flex w-full justify-start items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <LogOut className="w-5 h-5 flip-x" />
                  {t('nav.logout', { defaultMessage: 'Logout' })}
                </Button>
              </nav>
            </aside>
            
            <div className="flex-1 bg-card rounded-lg border p-6">
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
