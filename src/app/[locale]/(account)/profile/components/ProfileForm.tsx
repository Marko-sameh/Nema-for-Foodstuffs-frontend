'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '../validation/profile.schema';
import { useAuthStore } from '@/store/authStore';
import { useStore } from '@/hooks/useStore';
import { useUpdateProfile } from '../hooks/useProfile';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/forms/FormField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { SectionCard } from '@/components/shared/SectionCard';
import { useTranslations } from 'next-intl';

export function ProfileForm() {
  const t = useTranslations('account');
  const user = useStore(useAuthStore, (s) => s.user);
  const { mutate: updateProfile, isPending, error } = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user, form]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(values);
  };

  if (!user) return null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <FormError message={(error as Error)?.message} />

        <SectionCard title={t('profile.personalInfo', { defaultMessage: 'Personal Information' })} description={t('profile.updateDetails', { defaultMessage: 'Update your basic profile details.' })}>
          <div className="space-y-4">
            <FormField 
              control={form.control} 
              name="name" 
              label={t('profile.fullName', { defaultMessage: 'Full Name' })} 
            />

            <FormField 
              control={form.control} 
              name="email" 
              label={t('profile.email', { defaultMessage: 'Email Address' })} 
              type="email"
              disabled // Emails usually require a different flow to change
            />

            <FormField 
              control={form.control} 
              name="phone" 
              label={t('profile.phone', { defaultMessage: 'Phone Number' })} 
            />
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} className="w-full sm:w-auto px-8">
            {isPending ? t('profile.saving', { defaultMessage: 'Saving...' }) : t('profile.saveChanges', { defaultMessage: 'Save Changes' })}
          </Button>
        </div>
      </form>
    </Form>
  );
}
