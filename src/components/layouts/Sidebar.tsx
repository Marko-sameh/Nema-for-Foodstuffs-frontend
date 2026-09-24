'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingCart, 
  Users, 
  BarChart3,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export function Sidebar() {
  const t = useTranslations('admin');
  const tc = useTranslations('common');
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await useAuthStore.getState().logout();
    queryClient.clear();
    router.push('/login');
  };

  const links = [
    { href: '/admin/dashboard', label: t('nav.dashboard', { defaultMessage: 'Dashboard' }), icon: LayoutDashboard },
    { href: '/admin/products', label: t('nav.products', { defaultMessage: 'Products' }), icon: Package },
    { href: '/admin/categories', label: t('nav.categories', { defaultMessage: 'Categories' }), icon: Tags },
    { href: '/admin/orders', label: t('nav.orders', { defaultMessage: 'Orders' }), icon: ShoppingCart },
    { href: '/admin/users', label: t('nav.users', { defaultMessage: 'Users' }), icon: Users },
    { href: '/admin/analytics', label: t('nav.analytics', { defaultMessage: 'Analytics' }), icon: BarChart3 },
    { href: '/admin/settings', label: t('nav.settings', { defaultMessage: 'Settings' }), icon: Settings },
  ];

  return (
    <aside className="w-64 border-e bg-card flex flex-col h-screen sticky top-0 hidden md:flex">
      <div className="h-16 flex items-center px-6 border-b">
        <Link href="/" className="font-bold text-2xl text-primary">
          Ne'ma <span className="text-sm text-muted-foreground ms-1">{tc('misc.adminLabel')}</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
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
      </div>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex w-full justify-start items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5 flip-x" />
          {t('nav.logout', { defaultMessage: 'Logout' })}
        </Button>
      </div>
    </aside>
  );
}
