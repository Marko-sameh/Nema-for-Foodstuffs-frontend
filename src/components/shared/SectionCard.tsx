import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  /** Extra content rendered in the header area (right side) */
  headerAction?: ReactNode;
}

/**
 * Card wrapper for grouping related form sections.
 * Used in AdminProductForm, ProfileForm, CheckoutForm, etc.
 *
 * @example
 * <SectionCard title="Basic Info" description="Product name and category">
 *   <FormField ... />
 * </SectionCard>
 */
export function SectionCard({
  title,
  description,
  children,
  className,
  headerAction,
}: SectionCardProps) {
  return (
    <div className={cn('bg-card border rounded-xl p-6', className)}>
      {(title || headerAction) && (
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            {title && <h3 className="font-semibold text-base">{title}</h3>}
            {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
