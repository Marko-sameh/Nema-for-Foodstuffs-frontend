import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Leaf, ShieldCheck, Timer } from 'lucide-react';

export async function PromiseSection() {
  const t = await getTranslations('home.promise');

  const points = [
    {
      icon: Timer,
      title: t('items.fresh.title', { defaultMessage: 'Sourced at peak season' }),
      body: t('items.fresh.body', { defaultMessage: 'We buy in season and store it right, so flavour stays where it belongs.' }),
    },
    {
      icon: Leaf,
      title: t('items.clean.title', { defaultMessage: 'Nothing but the good stuff' }),
      body: t('items.clean.body', { defaultMessage: 'No fillers, no mystery additives — just clean, honest ingredients.' }),
    },
    {
      icon: ShieldCheck,
      title: t('items.honest.title', { defaultMessage: 'Honest pricing' }),
      body: t('items.honest.body', { defaultMessage: 'Clear prices by the kilo, half or quarter. No hidden extras at checkout.' }),
    },
  ];

  return (
    <section className="bg-ice">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 lg:grid-cols-2 lg:py-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[0_30px_80px_-40px_rgba(18,26,22,0.5)]">
          <Image
            src="/images/promise.jpg"
            alt={t('imageAlt', { defaultMessage: 'Close-up of premium nuts and dates' })}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 90vw, 560px"
            className="object-cover"
          />
        </div>

        <div>
          <span className="eyebrow">{t('eyebrow', { defaultMessage: 'Our promise' })}</span>
          <h2 className="display-lg mt-2 text-foreground">
            {t('titleStart', { defaultMessage: 'Why families' })}{' '}
            <span className="italic text-primary">{t('titleAccent', { defaultMessage: 'keep coming back' })}</span>
          </h2>

          <ul className="mt-8 space-y-6">
            {points.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-card text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-display text-lg text-foreground">{title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
