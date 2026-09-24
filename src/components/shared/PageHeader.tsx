'use client';

import { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional eyebrow text (e.g., 'Shop by category') */
  eyebrow?: string;
  /** Optional subtitle / description */
  description?: string;
  /** Breadcrumb trail */
  breadcrumbs?: BreadcrumbItem[];
  /** Buttons / actions rendered to the right */
  actions?: ReactNode;
  className?: string;
}

/**
 * Standardised page header used across ALL admin and account pages.
 * Renders title, optional description, breadcrumbs, and an action slot.
 *
 * @example
 * <PageHeader
 *   title="Products"
 *   eyebrow="The full shelf"
 *   breadcrumbs={[{ label: 'Dashboard', href: '/admin/dashboard' }, { label: 'Products' }]}
 *   actions={<Link href="/admin/products/create"><Button>Add Product</Button></Link>}
 * />
 */
export function PageHeader({ title, eyebrow, description, breadcrumbs, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-10 space-y-2', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center gap-1 text-sm text-muted-foreground flex-wrap">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <li key={item.label} className="flex items-center gap-1">
                  {index > 0 && (
                    <>
                      <ChevronRight className="h-3.5 w-3.5 rtl:hidden" />
                      <ChevronLeft className="h-3.5 w-3.5 hidden rtl:block" />
                    </>
                  )}
                  {isLast || !item.href ? (
                    <span className={isLast ? 'text-foreground font-medium' : ''}>{item.label}</span>
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
      )}

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className={cn('display-lg text-foreground', eyebrow ? 'mt-2' : '')}>{title}</h1>
          {description && (
            <p className="mt-2 max-w-lg text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
