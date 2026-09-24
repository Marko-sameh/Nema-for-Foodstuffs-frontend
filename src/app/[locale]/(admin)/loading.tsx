import { TableSkeleton } from '@/components/shared/LoadingState';

export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-48 rounded-md shimmer-skeleton" />
      <TableSkeleton rows={8} cols={5} />
    </div>
  );
}
