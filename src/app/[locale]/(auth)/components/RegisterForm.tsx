'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '../validation/auth.schema';
import { useRegister } from '../hooks/useAuth';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const router = useRouter();
  const { mutate: register, isPending, error } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    register(values, {
      onSuccess: () => {
        router.push('/');
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormError message={(error as Error)?.message} />

        <FormField 
          control={form.control} 
          name="name" 
          label={t('fullName', { defaultMessage: 'Full Name' })} 
          placeholder={t('fullNamePlaceholder', { defaultMessage: 'John Doe' })} 
        />

        <FormField 
          control={form.control} 
          name="email" 
          label={t('emailAddress', { defaultMessage: 'Email Address' })} 
          placeholder={t('emailPlaceholder', { defaultMessage: 'you@example.com' })} 
          type="email"
        />

        <FormField 
          control={form.control} 
          name="phone" 
          label={t('phoneNumber', { defaultMessage: 'Phone Number' })} 
          placeholder={t('phonePlaceholder', { defaultMessage: '+1 234 567 8900' })} 
        />

        <FormField 
          control={form.control} 
          name="password" 
          label={t('password', { defaultMessage: 'Password' })} 
          type="password" 
        />

        <FormField 
          control={form.control} 
          name="passwordConfirm" 
          label={t('confirmPassword', { defaultMessage: 'Confirm Password' })} 
          type="password" 
        />

        <Button type="submit" className="w-full h-12 mt-4" disabled={isPending}>
          {isPending ? t('creatingAccount', { defaultMessage: 'Creating account...' }) : t('createAccount', { defaultMessage: 'Create Account' })}
        </Button>

        <div className="text-center mt-6 text-sm text-muted-foreground">
          {t('haveAccount', { defaultMessage: 'Already have an account?' })}{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            {t('signInHere', { defaultMessage: 'Sign in here' })}
          </Link>
        </div>
      </form>
    </Form>
  );
}
