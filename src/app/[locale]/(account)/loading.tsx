import { FormSkeleton } from '@/components/shared/LoadingState';

export default function AccountLoading() {
  return (
    <div className="p-2">
      <FormSkeleton rows={4} />
    </div>
  );
}
