'use client';

import { useEffect, useState } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useAuthStore } from '@/store/authStore';
import { Sidebar } from '@/components/layouts/Sidebar';
import { AdminHeader } from '@/components/layouts/AdminHeader';
import { useTranslations } from 'next-intl';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuthStore();
  const t = useTranslations('common');
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && (!isAuthenticated || user?.role !== 'ADMIN')) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <p className="text-muted-foreground">{t("misc.redirecting")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
