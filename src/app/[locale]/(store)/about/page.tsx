import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { buildMetadata } from '@/lib/seo';
import { Leaf, ShieldCheck, Truck } from 'lucide-react';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return buildMetadata({
    locale,
    path: '/about',
    title: t('seo.title', { defaultMessage: 'About Us' }),
    description: t('seo.description', { defaultMessage: 'Who we are, how we source our food, and what we promise every family we deliver to.' }),
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  const values = [
    { icon: Leaf, title: t('values.quality.title', { defaultMessage: 'Quality first' }), body: t('values.quality.body', { defaultMessage: 'Every batch is tasted and checked before it reaches a shelf.' }) },
    { icon: ShieldCheck, title: t('values.trust.title', { defaultMessage: 'Honest pricing' }), body: t('values.trust.body', { defaultMessage: 'Clear prices by weight, with no surprises at checkout.' }) },
    { icon: Truck, title: t('values.delivery.title', { defaultMessage: 'Careful delivery' }), body: t('values.delivery.body', { defaultMessage: 'Packed with care and delivered straight to your kitchen.' }) },
  ];

  return (
    <div className="bg-background">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2">
        <div>
          <span className="eyebrow">{t('eyebrow', { defaultMessage: 'Our story' })}</span>
          <h1 className="display-xl mt-4 text-foreground">
            {t('titleStart', { defaultMessage: 'Real food,' })}{' '}
            <span className="italic text-primary">{t('titleAccent', { defaultMessage: 'chosen with care' })}</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            {t('body', { defaultMessage: 'We started with a simple idea: good ingredients should be easy to buy, honestly priced, and sold in the amount you actually need. We source from growers and suppliers we know, sell by the kilo, half or quarter, and deliver quickly so nothing loses its freshness.' })}
          </p>
          <Link href="/products" className="mt-8 inline-block">
            <Button className="h-12 rounded-full bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90">
              {t('cta', { defaultMessage: 'Browse the shop' })}
            </Button>
          </Link>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-[2.5rem]">
          <Image
            src="/images/promise.jpg"
            alt={t('imageAlt', { defaultMessage: 'Premium nuts, dates and spices' })}
            fill
            sizes="(max-width: 1024px) 90vw, 560px"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-ice">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:grid-cols-3">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-[1.75rem] bg-card p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </span>
              <h2 className="mt-5 font-display text-xl text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
