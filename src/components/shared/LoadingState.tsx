import { cn } from '@/lib/utils';

// ─── Inline Spinner ───────────────────────────────────────────────────────────
interface SpinnerProps { className?: string; size?: 'sm' | 'md' | 'lg'; }
const sizeMap = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-12 w-12' };

export function Spinner({ className, size = 'md' }: SpinnerProps) {
  return (
    <div className={cn('relative', sizeMap[size], className)}>
      <div className={cn(
        'absolute inset-0 rounded-full border-2 border-muted'
      )} />
      <div className={cn(
        'absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin'
      )} />
    </div>
  );
}

// ─── Full-page loading ────────────────────────────────────────────────────────
export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 animate-fade-in">
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}

// ─── Shimmer block (reusable) ─────────────────────────────────────────────────
function ShimmerBlock({ className }: { className?: string }) {
  return (
    <div className={cn(
      'rounded-xl shimmer-skeleton',
      className
    )} />
  );
}

// ─── Card grid skeletons (product listing) ────────────────────────────────────
interface CardSkeletonsProps { count?: number; }

export function CardSkeletons({ count = 8 }: CardSkeletonsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 p-4 rounded-2xl glass-card" style={{ animationDelay: `${i * 60}ms` }}>
          <ShimmerBlock className="aspect-square w-full" />
          <ShimmerBlock className="h-4 w-3/4" />
          <ShimmerBlock className="h-4 w-1/2" />
          <ShimmerBlock className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Category grid skeletons ───────────────────────────────────────────────────
interface CategorySkeletonsProps { count?: number; }

export function CategorySkeletons({ count = 6 }: CategorySkeletonsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3">
          <ShimmerBlock className="w-full aspect-square rounded-2xl" />
          <ShimmerBlock className="h-3.5 w-16" />
        </div>
      ))}
    </div>
  );
}

// ─── Form skeleton (profile, checkout) ───────────────────────────────────────
interface FormSkeletonProps { rows?: number; }

export function FormSkeleton({ rows = 5 }: FormSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <ShimmerBlock className="h-3.5 w-24" />
          <ShimmerBlock className="h-10 w-full" />
        </div>
      ))}
      <ShimmerBlock className="h-10 w-32 mt-2" />
    </div>
  );
}

// ─── Table row skeletons (admin lists) ────────────────────────────────────────
interface TableSkeletonProps { rows?: number; cols?: number; }

export function TableSkeleton({ rows = 6, cols = 5 }: TableSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, j) => (
            <ShimmerBlock key={j} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}
