import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'primary';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  danger:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info:    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
};

/**
 * Generic status badge used across the app for order statuses,
 * product active/inactive, user roles, etc.
 *
 * @example
 * <StatusBadge label="Delivered" variant="success" />
 * <StatusBadge label="Cancelled" variant="danger" />
 */
export function StatusBadge({ label, variant = 'neutral', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap',
        variantStyles[variant],
        className,
      )}
    >
      {label}
    </span>
  );
}
