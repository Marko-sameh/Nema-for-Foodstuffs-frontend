import { AlertCircle } from 'lucide-react';

interface FormErrorProps {
  message?: string;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md flex items-center gap-x-2">
      <AlertCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
}
