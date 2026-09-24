import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '../components/ResetPasswordForm';
import { buildMetadata } from '@/lib/seo';

interface ResetPasswordPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata({ params }: ResetPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.resetPassword' });
  return buildMetadata({
    locale,
    path: '/reset-password',
    title: t('title', { defaultMessage: 'Reset Password' }),
    description: t('seoDescription', { defaultMessage: 'Choose a new password for your account.' }),
  });
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const t = await getTranslations('auth.resetPassword');
  const { token } = await searchParams;

  return (
    <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-6">
        {t('title', { defaultMessage: 'Reset Password' })}
      </h1>
      <ResetPasswordForm token={token} />
    </div>
  );
}
