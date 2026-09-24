"use client";

import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { ShoppingBag, User, Search, Heart, Menu } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { useStore } from '@/hooks/useStore';
import { useQueryClient } from '@tanstack/react-query';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const t = useTranslations('common');
  const cartItems = useStore(useCartStore, (state) => state.items) || [];
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState('');
  const user = useStore(useAuthStore, (state) => state.user);

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    queryClient.clear();
    router.push('/login');
  };

  const navLinks = [
    { href: '/', label: t('nav.home', { defaultMessage: 'Home' }) },
    { href: '/products', label: t('nav.products', { defaultMessage: 'Products' }) },
    { href: '/categories', label: t('nav.categories', { defaultMessage: 'Categories' }) },
  ];

  return (
    <>
      {/* Announcement bar - scrolls away naturally */}
      <div className="bg-foreground px-4 py-2 text-center text-[11px] font-medium tracking-wide text-background">
        {t('announcement', { defaultMessage: 'Free delivery on orders over 500 EGP • Freshly sourced, always delicious' })}
      </div>

      {/* Floating Sticky Header */}
      <div className="sticky top-4 z-50 px-4 md:px-6 w-full max-w-7xl mx-auto pointer-events-none mt-4 transition-all duration-300">
        <header className="pointer-events-auto w-full rounded-full border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-white/5 transition-all">
          <div className="mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
            {/* Mobile Menu & Logo */}
            <div className="flex shrink-0 items-center gap-3">
              <Sheet>
                <SheetTrigger
                  render={<Button variant="ghost" size="icon" className="rounded-full text-foreground md:hidden hover:bg-accent" />}
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t("misc.toggleMenu")}</span>
                </SheetTrigger>
                <SheetContent side="left" className="bg-background w-[300px]">
                  <nav className="mt-8 flex flex-col gap-4">
                    {navLinks.map(({ href, label }) => (
                      <Link key={href} href={href} className="font-display text-xl text-foreground transition-colors hover:text-primary">{label}</Link>
                    ))}
                    <Link href="/wishlist" className="font-display text-xl text-foreground transition-colors hover:text-primary">{t('nav.wishlist', { defaultMessage: 'Wishlist' })}</Link>
                    <Link href="/cart" className="font-display text-xl text-foreground transition-colors hover:text-primary">{t('nav.cart', { defaultMessage: 'Cart' })}</Link>
                    <Link href={user ? '/profile' : '/login'} className="font-display text-xl text-foreground transition-colors hover:text-primary">{t('nav.account', { defaultMessage: 'My Account' })}</Link>
                  </nav>
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary font-display text-lg leading-none text-primary-foreground shadow-sm">
                  {t('brand.logo', { defaultMessage: 'N' })}
                </span>
                <span className="hidden sm:block">
                  <span className="block font-display text-xl leading-none text-foreground tracking-tight">
                    {t('brand.name', { defaultMessage: "Ne'ma" })}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    {t('brand.subtitle', { defaultMessage: 'Foodstuffs' })}
                  </span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav - Centered with Pill Hovers */}
            <nav className="hidden items-center gap-1 lg:gap-2 md:flex">
              {navLinks.map(({ href, label }) => (
                <Link key={href} href={href} className="px-4 py-2 rounded-full text-sm font-semibold text-foreground/80 transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-md">
                  {label}
                </Link>
              ))}
            </nav>

            {/* Search + Actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <form
                onSubmit={(e) => { e.preventDefault(); if (query.trim()) router.push(`/search?q=${encodeURIComponent(query)}`); }}
                className="relative hidden items-center lg:flex group"
              >
                <Input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder', { defaultMessage: 'Search...' })}
                  className="w-36 lg:w-48 rounded-full border-border/50 bg-background/50 backdrop-blur-sm py-1.5 pe-4 ps-9 text-sm transition-all duration-300 focus-visible:w-56 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary hover:bg-background"
                />
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground group-focus-within:text-primary" />
              </form>

              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="rounded-full text-foreground hover:bg-accent transition-colors">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/cart">
                <Button className="h-10 gap-2 rounded-full bg-foreground px-4 text-sm font-bold text-background transition-all hover:bg-primary hover:shadow-lg hover:shadow-primary/25">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="hidden sm:inline">{t('nav.cart', { defaultMessage: 'Cart' })}</span>
                  {cartCount > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black leading-none text-primary-foreground shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {user?.role === 'ADMIN' && (
                <Link href="/admin/dashboard">
                  <Button variant="ghost" className="hidden gap-2 rounded-full px-3 text-sm font-bold text-foreground transition-colors hover:bg-accent sm:flex">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
                    {t('misc.adminLabel', { defaultMessage: 'Admin' })}
                  </Button>
                </Link>
              )}

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" className="rounded-full text-foreground hover:bg-accent transition-colors" />}
                  >
                    <User className="h-5 w-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border/50 backdrop-blur-xl bg-background/95">
                    <div className="flex items-center justify-start gap-3 p-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                        {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                      </div>
                      <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-semibold text-sm">{user.name}</p>}
                        {user.email && (
                          <p className="w-[150px] truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem className="rounded-xl cursor-pointer py-2">
                      <Link href="/profile" className="block w-full font-medium">
                        {t('nav.profile', { defaultMessage: 'Profile' })}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl cursor-pointer py-2">
                      <Link href="/orders" className="block w-full font-medium">
                        {t('nav.orders', { defaultMessage: 'Orders' })}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      className="rounded-xl cursor-pointer py-2 text-destructive font-medium focus:bg-destructive/10 focus:text-destructive"
                      onClick={handleLogout}
                    >
                      {t('auth.logout', { defaultMessage: 'Logout' })}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="icon" className="rounded-full text-foreground hover:bg-accent transition-colors">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
