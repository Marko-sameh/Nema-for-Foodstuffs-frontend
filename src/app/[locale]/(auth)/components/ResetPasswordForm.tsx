'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema, ResetPasswordFormValues } from '../validation/auth.schema';
import { useResetPassword } from '../hooks/useAuth';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { CheckCircle2 } from 'lucide-react';

interface ResetPasswordFormProps {
  token?: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const { mutate: resetPassword, isPending, error } = useResetPassword();
  const [success, setSuccess] = useState(false);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', passwordConfirm: '' },
  });

  if (!token) {
    return (
      <FormError message={t('missingToken', { defaultMessage: 'This password reset link is invalid or has expired. Please request a new one.' })} />
    );
  }

  const onSubmit = (values: ResetPasswordFormValues) => {
    resetPassword(
      { token, newPassword: values.password },
      {
        onSuccess: () => {
          setSuccess(true);
          setTimeout(() => router.push('/login'), 2000);
        },
      }
    );
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <p className="text-muted-foreground">
          {t('successMessage', { defaultMessage: 'Your password has been reset successfully. Redirecting to login...' })}
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
          name="password"
          label={t('newPassword', { defaultMessage: 'New Password' })}
          type="password"
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          label={t('confirmPassword', { defaultMessage: 'Confirm Password' })}
          type="password"
        />

        <Button type="submit" className="w-full h-12 mt-4" disabled={isPending}>
          {isPending ? t('resetting', { defaultMessage: 'Resetting...' }) : t('resetPassword', { defaultMessage: 'Reset Password' })}
        </Button>
      </form>
    </Form>
  );
}
