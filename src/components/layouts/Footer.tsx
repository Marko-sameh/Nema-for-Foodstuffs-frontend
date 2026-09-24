import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('common');

  return (
    <footer className="mt-auto bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-lg text-primary-foreground">
                {t('brand.logo', { defaultMessage: 'N' })}
              </span>
              <span className="font-display text-2xl">{t('brand.name', { defaultMessage: "Ne'ma" })}</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/60">
              {t('footer.about', { defaultMessage: 'Premium foodstuffs and groceries delivered directly to your door with the highest quality standards.' })}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-background/50">
              {t('footer.quickLinks', { defaultMessage: 'Quick Links' })}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-background/80">
              <li><Link href="/" className="transition-colors hover:text-primary">{t('nav.home', { defaultMessage: 'Home' })}</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-primary">{t('nav.products', { defaultMessage: 'Products' })}</Link></li>
              <li><Link href="/categories" className="transition-colors hover:text-primary">{t('nav.categories', { defaultMessage: 'Categories' })}</Link></li>
              <li><Link href="/cart" className="transition-colors hover:text-primary">{t('nav.cart', { defaultMessage: 'Cart' })}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-background/50">
              {t('footer.customerService', { defaultMessage: 'Customer Service' })}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-background/80">
              <li><Link href="/profile" className="transition-colors hover:text-primary">{t('nav.account', { defaultMessage: 'My Account' })}</Link></li>
              <li><Link href="/orders" className="transition-colors hover:text-primary">{t('nav.orders', { defaultMessage: 'Track Order' })}</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">{t('nav.contact', { defaultMessage: 'Contact Us' })}</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-primary">{t('nav.about', { defaultMessage: 'About Us' })}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.18em] text-background/50">
              {t('footer.contactInfo', { defaultMessage: 'Contact Info' })}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-background/80">
              <li>info@nema.com</li>
              <li>+20 100 000 0000</li>
              <li>{t('footer.address', { defaultMessage: 'Cairo, Egypt' })}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-8 md:flex-row">
          <p className="text-xs text-background/50">
            &copy; {new Date().getFullYear()} {t('brand.name', { defaultMessage: "Ne'ma" })}. {t('footer.rights', { defaultMessage: 'All rights reserved.' })}
          </p>
        </div>
      </div>
    </footer>
  );
}
