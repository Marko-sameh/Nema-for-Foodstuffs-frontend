'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '../validation/auth.schema';
import { useForgotPassword } from '../hooks/useAuth';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = (values: ForgotPasswordFormValues) => {
    forgotPassword(values, { onSuccess: () => setSubmitted(true) });
  };

  if (submitted) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <p className="text-muted-foreground">
          {t('successMessage', { defaultMessage: 'If an account exists for that email, we\'ve sent a link to reset your password.' })}
        </p>
        <Link href="/login" className="text-primary font-semibold hover:underline">
          {t('backToLogin', { defaultMessage: 'Back to login' })}
        </Link>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormError message={(error as Error)?.message} />

        <FormField
          control={form.control}
          name="email"
          label={t('emailAddress', { defaultMessage: 'Email Address' })}
          placeholder={t('emailPlaceholder', { defaultMessage: 'you@example.com' })}
          type="email"
        />

        <Button type="submit" className="w-full h-12 mt-4" disabled={isPending}>
          {isPending ? t('sending', { defaultMessage: 'Sending...' }) : t('sendResetLink', { defaultMessage: 'Send Reset Link' })}
        </Button>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          <Link href="/login" className="text-primary font-semibold hover:underline">
            {t('backToLogin', { defaultMessage: 'Back to login' })}
          </Link>
        </div>
      </form>
    </Form>
  );
}
