import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '../components/ForgotPasswordForm';
import { buildMetadata } from '@/lib/seo';

interface ForgotPasswordPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ForgotPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.forgotPassword' });
  return buildMetadata({
    locale,
    path: '/forgot-password',
    title: t('title', { defaultMessage: 'Forgot Password' }),
    description: t('seoDescription', { defaultMessage: 'Reset your account password.' }),
  });
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations('auth.forgotPassword');

  return (
    <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-2">
        {t('title', { defaultMessage: 'Forgot Password' })}
      </h1>
      <p className="text-sm text-muted-foreground text-center mb-6">
        {t('subtitle', { defaultMessage: "Enter your email and we'll send you a link to reset your password." })}
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
