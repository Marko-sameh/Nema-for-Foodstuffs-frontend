import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFoundPage() {
  const t = useTranslations('common');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">{t('notFoundTitle', { defaultMessage: 'Page Not Found' })}</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        {t('notFoundDesc', { defaultMessage: 'The page you are looking for does not exist or has been moved.' })}
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
      >
        {t('goHome', { defaultMessage: 'Go to Home' })}
      </Link>
    </div>
  );
}
