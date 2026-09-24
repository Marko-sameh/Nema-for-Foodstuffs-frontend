import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { RegisterForm } from '../components/RegisterForm';
import { buildMetadata } from '@/lib/seo';

interface RegisterPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth' });
  return buildMetadata({
    locale,
    path: '/register',
    title: t('register.title', { defaultMessage: 'Create an account' }),
    description: t('register.seoDescription', { defaultMessage: 'Create an account to start shopping with us.' }),
  });
}

export default async function RegisterPage() {
  const t = await getTranslations('auth');

  return (
    <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">
        {t('register.title', { defaultMessage: 'Create an account' })}
      </h1>
      <RegisterForm />
    </div>
  );
}
