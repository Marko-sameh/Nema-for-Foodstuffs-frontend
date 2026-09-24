'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/EmptyState';
import { AlertTriangle } from 'lucide-react';

export default function AccountError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <EmptyState
      icon={<AlertTriangle className="w-10 h-10" />}
      title={t('errors.title', { defaultMessage: 'Something went wrong' })}
      description={t('errors.description', { defaultMessage: 'An unexpected error occurred while loading this page. Please try again.' })}
      action={
        <div className="flex items-center gap-3">
          <Button onClick={reset}>{t('errors.retry', { defaultMessage: 'Try again' })}</Button>
          <Link href="/">
            <Button variant="outline">{t('errors.goHome', { defaultMessage: 'Go to Home' })}</Button>
          </Link>
        </div>
      }
    />
  );
}
