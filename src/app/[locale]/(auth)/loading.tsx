import { FormSkeleton } from '@/components/shared/LoadingState';

export default function AuthLoading() {
  return (
    <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm">
      <FormSkeleton rows={3} />
    </div>
  );
}
