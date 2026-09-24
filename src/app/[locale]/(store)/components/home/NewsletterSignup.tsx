'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';

export function NewsletterSignup() {
  const t = useTranslations('home.newsletter');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmail('');
      toast.success(t('successTitle', { defaultMessage: 'Thanks for subscribing!' }), {
        description: t('successDescription', { defaultMessage: 'You will receive our latest offers soon.' }),
      });
    }, 1000);
  };

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="overflow-hidden rounded-[2.5rem] bg-primary px-6 py-14 text-center text-primary-foreground md:px-16">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-80">
          {t('eyebrow', { defaultMessage: 'Join the table' })}
        </span>
        <h2 className="display-lg mx-auto mt-3 max-w-2xl text-primary-foreground">
          {t('title', { defaultMessage: 'Stay Fresh, Stay Updated' })}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed opacity-85 md:text-base">
          {t('description', { defaultMessage: 'Subscribe to our newsletter and get 10% off your first order, plus exclusive weekly deals on fresh produce.' })}
        </p>

        <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder={t('emailPlaceholder', { defaultMessage: 'Enter your email address' })}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-full border-transparent bg-card px-5 text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 shrink-0 rounded-full bg-foreground px-8 text-sm font-bold text-background hover:bg-foreground/90"
          >
            {isLoading
              ? t('subscribing', { defaultMessage: 'Subscribing...' })
              : t('subscribe', { defaultMessage: 'Subscribe' })}
          </Button>
        </form>
      </div>
    </section>
  );
}
