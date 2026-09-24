import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-12 min-h-[360px] rounded-2xl",
      "bg-gradient-to-b from-muted/30 to-transparent border border-dashed border-border/60",
      "animate-fade-in",
      className
    )}>
      {icon && (
        <div className="relative mb-6">
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-60" style={{ animationDuration: '2.5s' }} />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/15 to-secondary/10 border border-primary/20 text-primary shadow-lg">
            {icon}
          </div>
        </div>
      )}
      <h3 className="text-xl font-bold tracking-tight text-foreground mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1 max-w-sm leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
