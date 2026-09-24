import { useTranslations } from 'next-intl';
import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/hooks/useStore';

export function AdminHeader() {
  const t = useTranslations('admin');
  const user = useStore(useAuthStore, (state) => state.user);

  return (
    <header className="h-16 border-b bg-card flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg hidden sm:block">
          {t('welcome', { name: user?.name || 'Admin' })}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 end-1.5 flex h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}
