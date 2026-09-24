import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '../components/LoginForm';
import { buildMetadata } from '@/lib/seo';

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  return buildMetadata({
    locale,
    path: '/login',
    title: t('login.title', { defaultMessage: 'Login to your account' }),
    description: t('login.seoDescription', { defaultMessage: 'Login to your account to track orders and manage your wishlist.' }),
  });
}

export default async function LoginPage() {
  const t = await getTranslations('auth');

  return (
    <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">
        {t('login.title', { defaultMessage: 'Login to your account' })}
      </h1>
      <LoginForm />
    </div>
  );
}
