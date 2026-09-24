import { Link } from '@/i18n/navigation';
import { ChevronRight, ChevronLeft, Home } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const t = useTranslations('common');

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center space-x-2 text-sm text-muted-foreground whitespace-nowrap overflow-x-auto">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors flex items-center">
            <Home className="w-4 h-4" />
            <span className="sr-only">{t('nav.home', { defaultMessage: 'Home' })}</span>
          </Link>
        </li>
        
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.label} className="flex items-center">
              <ChevronRight className="w-4 h-4 mx-1 rtl:hidden" />
              <ChevronLeft className="w-4 h-4 mx-1 hidden rtl:block" />
              {isLast || !item.href ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
