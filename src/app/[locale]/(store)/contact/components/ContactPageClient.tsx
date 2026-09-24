'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail, MapPin, Phone } from 'lucide-react';

const CONTACT_EMAIL = 'info@nema.com';

export function ContactPageClient() {
  const t = useTranslations('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No transactional mail provider is configured yet, so the message is handed
    // to the visitor's own mail client instead of being silently dropped.
    const subject = encodeURIComponent(t('mailSubject', { name, defaultMessage: 'Message from {name}' }));
    const body = encodeURIComponent(`${message}\n\n${name} — ${email}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  const details = [
    { icon: Mail, label: t('details.email', { defaultMessage: 'Email' }), value: CONTACT_EMAIL },
    { icon: Phone, label: t('details.phone', { defaultMessage: 'Phone' }), value: '+20 100 000 0000' },
    { icon: MapPin, label: t('details.address', { defaultMessage: 'Address' }), value: t('details.addressValue', { defaultMessage: 'Cairo, Egypt' }) },
  ];

  return (
    <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2">
      <div>
        <span className="eyebrow">{t('eyebrow', { defaultMessage: 'Get in touch' })}</span>
        <h1 className="display-lg mt-3 text-foreground">
          {t('title', { defaultMessage: 'We would love to hear from you' })}
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {t('subtitle', { defaultMessage: 'Questions about an order, a product or delivery? Send us a note and our team will get back to you.' })}
        </p>

        <ul className="mt-10 space-y-6">
          {details.map(({ icon: Icon, label, value }) => (
            <li key={label} className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
                <span className="block text-sm font-semibold text-foreground">{value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="rounded-[2rem] border border-border bg-card p-8">
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="contact-name">{t('form.name', { defaultMessage: 'Your name' })}</Label>
            <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} required className="h-12 rounded-full px-5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">{t('form.email', { defaultMessage: 'Your email' })}</Label>
            <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 rounded-full px-5" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-message">{t('form.message', { defaultMessage: 'Message' })}</Label>
            <Textarea id="contact-message" value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} className="rounded-3xl px-5 py-4" />
          </div>
          <Button type="submit" className="h-12 w-full rounded-full bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90">
            {t('form.submit', { defaultMessage: 'Send message' })}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {t('form.note', { defaultMessage: 'This opens your email app so your message is sent directly to our team.' })}
          </p>
        </div>
      </form>
    </div>
  );
}
