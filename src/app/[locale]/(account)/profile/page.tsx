import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ProfileForm } from './components/ProfileForm';
import { buildPrivateMetadata } from '@/lib/seo';

interface ProfilePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'account' });
  return buildPrivateMetadata(t('nav.profile', { defaultMessage: 'Profile' }));
}

export default async function ProfilePage() {
  const t = await getTranslations('account');
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">{t('nav.profile', { defaultMessage: 'Profile' })}</h2>
      <ProfileForm />
    </div>
  );
}
