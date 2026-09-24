'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '../validation/auth.schema';
import { useLogin } from '../hooks/useAuth';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    login(values, {
      onSuccess: () => {
        // Redirect to requested page or home
        const searchParams = new URLSearchParams(window.location.search);
        const returnUrl = searchParams.get('returnUrl') || '/';
        router.push(returnUrl as any);
      }
    });
  };

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

        <FormField 
          control={form.control} 
          name="password" 
          label={t('password', { defaultMessage: 'Password' })} 
          type="password" 
        />

        <div className="text-end -mt-2">
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            {t('forgotPassword', { defaultMessage: 'Forgot password?' })}
          </Link>
        </div>

        <Button type="submit" className="w-full h-12 mt-4" disabled={isPending}>
          {isPending ? t('signingIn', { defaultMessage: 'Signing in...' }) : t('signIn', { defaultMessage: 'Sign In' })}
        </Button>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          {t('noAccount', { defaultMessage: "Don't have an account?" })}{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            {t('registerHere', { defaultMessage: 'Register here' })}
          </Link>
        </div>
      </form>
    </Form>
  );
}
