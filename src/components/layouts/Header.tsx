"use client";

import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag, User, Search, Heart, Menu } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { useQueryClient } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const t = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const cartItems = useStore(useCartStore, (state) => state.items) || [];
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [query, setQuery] = useState("");
  const user = useStore(useAuthStore, (state) => state.user);

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    queryClient.clear();
    router.push("/login");
  };

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    router.replace(pathname, { locale: nextLocale });
  };

  const navLinks = [
    { href: "/", label: t("nav.home", { defaultMessage: "Home" }) },
    {
      href: "/products",
      label: t("nav.products", { defaultMessage: "Products" }),
    },
    {
      href: "/categories",
      label: t("nav.categories", { defaultMessage: "Categories" }),
    },
  ];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-foreground px-4 py-2 text-center text-[11px] font-medium tracking-wide text-background">
        {t("announcement", {
          defaultMessage:
            "Free delivery on orders over 500 EGP • Freshly sourced, always delicious",
        })}
      </div>

      {/* Floating Sticky Header */}
      <div className="sticky top-4 z-50 px-4 md:px-6 w-full max-w-7xl mx-auto pointer-events-none mt-4 transition-all duration-300">
        <header className="pointer-events-auto w-full rounded-full border border-border/50 bg-background/80 backdrop-blur-xl shadow-xl shadow-black/5 dark:shadow-white/5 transition-all">
          {/* 3-column grid: Logo | Nav | Actions */}
          <div className="mx-auto grid h-16 grid-cols-3 items-center px-4 sm:px-6">
            {/* ── LEFT: Hamburger (mobile) + Logo ── */}
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full text-foreground md:hidden hover:bg-accent"
                    />
                  }
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t("misc.toggleMenu")}</span>
                </SheetTrigger>
                <SheetContent side="left" className="bg-background w-[300px]">
                  <nav className="mt-8 flex flex-col gap-4">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className="font-display text-xl text-foreground transition-colors hover:text-primary"
                      >
                        {label}
                      </Link>
                    ))}
                    <Link
                      href="/wishlist"
                      className="font-display text-xl text-foreground transition-colors hover:text-primary"
                    >
                      {t("nav.wishlist", { defaultMessage: "Wishlist" })}
                    </Link>
                    <Link
                      href="/cart"
                      className="font-display text-xl text-foreground transition-colors hover:text-primary"
                    >
                      {t("nav.cart", { defaultMessage: "Cart" })}
                    </Link>
                    <Link
                      href={user ? "/profile" : "/login"}
                      className="font-display text-xl text-foreground transition-colors hover:text-primary"
                    >
                      {t("nav.account", { defaultMessage: "My Account" })}
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>

              {/* Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 transition-transform hover:scale-105"
              >
                <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary font-display text-lg leading-none text-primary-foreground shadow-sm">
                  {t("brand.logo", { defaultMessage: "N" })}
                </span>
                <span className="hidden sm:block">
                  <span className="block font-display text-xl leading-none text-foreground tracking-tight">
                    {t("brand.name", { defaultMessage: "Ne'ma" })}
                  </span>
                  <span className="block text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">
                    {t("brand.subtitle", { defaultMessage: "Foodstuffs" })}
                  </span>
                </span>
              </Link>
            </div>

            {/* ── CENTER: NavigationMenu (desktop only) ── */}
            <div className="hidden md:flex justify-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-1 lg:gap-2">
                  {navLinks.map(({ href, label }) => (
                    <NavigationMenuItem key={href}>
                      <NavigationMenuLink
                        render={<Link href={href} />}
                        className="px-4 py-2 rounded-full text-sm font-semibold text-foreground/80 transition-all duration-300 hover:bg-foreground hover:text-background hover:shadow-md"
                      >
                        {label}
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* ── RIGHT: Actions ── */}
            <div className="flex items-center justify-end gap-1.5 md:gap-2">
              {/* Language toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLanguage}
                className="rounded-full text-foreground hover:bg-accent transition-colors"
                title={t("misc.switchLanguage", {
                  defaultMessage: "Switch Language",
                })}
              >
                {locale === "en" ? (
                  <span className="font-bold text-sm">ع</span>
                ) : (
                  <span className="font-bold text-sm">EN</span>
                )}
              </Button>

              {/* Search (desktop only) */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (query.trim())
                    router.push(`/search?q=${encodeURIComponent(query)}`);
                }}
                className="relative hidden items-center lg:flex group"
              >
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder", {
                    defaultMessage: "Search...",
                  })}
                  className="w-36 lg:w-44 rounded-full border-border/50 bg-background/50 backdrop-blur-sm py-1.5 pe-4 ps-9 text-sm transition-all duration-300 focus-visible:w-52 focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary hover:bg-background"
                />
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground group-focus-within:text-primary" />
              </form>

              {/* Wishlist */}
              <Link href="/wishlist">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-foreground hover:bg-accent transition-colors"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <Button className="h-10 gap-2 rounded-full bg-foreground px-4 text-sm font-bold text-background transition-all hover:bg-primary hover:shadow-lg hover:shadow-primary/25">
                  <ShoppingBag className="h-4 w-4" />
                  {/* <span className="hidden sm:inline">
                    {t("nav.cart", { defaultMessage: "Cart" })}
                  </span> */}
                  {cartCount > 0 && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-black leading-none text-primary-foreground shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Admin badge */}
              {user?.role === "ADMIN" && (
                <Link href="/admin/dashboard">
                  <Button
                    variant="ghost"
                    className="hidden gap-2 rounded-full px-3 text-sm font-bold text-foreground transition-colors hover:bg-accent sm:flex"
                  >
                    <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)]"></span>
                    {t("misc.adminLabel", { defaultMessage: "Admin" })}
                  </Button>
                </Link>
              )}

              {/* User menu / login */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold select-none transition-all hover:bg-primary/20 hover:ring-2 hover:ring-primary/30 focus:outline-none"
                      />
                    }
                  >
                    {user.name ? (
                      user.name.charAt(0).toUpperCase()
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="w-60 rounded-xl border border-border bg-background p-0 shadow-lg"
                  >
                    {/* User info header */}
                    <div className="flex items-center gap-3 bg-[#FFF0F0] px-4 py-3 rounded-t-xl border-b border-[#F0DADA]">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-base font-bold">
                        {user.name ? (
                          user.name.charAt(0).toUpperCase()
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        {user.name && (
                          <p className="truncate text-sm font-bold text-foreground">
                            {user.name}
                          </p>
                        )}
                        {user.email && (
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1">
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80"
                        render={
                          <Link
                            href="/profile"
                            className="flex w-full items-center gap-2.5"
                          />
                        }
                      >
                        <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {t("nav.profile", { defaultMessage: "Profile" })}
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80"
                        render={
                          <Link
                            href="/orders"
                            className="flex w-full items-center gap-2.5"
                          />
                        }
                      >
                        <ShoppingBag className="h-4 w-4 shrink-0 text-muted-foreground" />
                        {t("nav.orders", { defaultMessage: "Orders" })}
                      </DropdownMenuItem>

                      {user.role === "ADMIN" && (
                        <DropdownMenuItem
                          className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground/80"
                          render={
                            <Link
                              href="/admin/dashboard"
                              className="flex w-full items-center gap-2.5"
                            />
                          }
                        >
                          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-primary" />
                          {t("misc.adminLabel", { defaultMessage: "Admin" })}
                        </DropdownMenuItem>
                      )}
                    </div>

                    <DropdownMenuSeparator />

                    <div className="p-1">
                      <DropdownMenuItem
                        className="cursor-pointer rounded-lg px-3 py-2.5 text-sm font-semibold text-destructive data-[variant=destructive]:focus:bg-destructive/10"
                        variant="destructive"
                        onClick={handleLogout}
                      >
                        {t("auth.logout", { defaultMessage: "Logout" })}
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-foreground hover:bg-accent transition-colors"
                  >
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
