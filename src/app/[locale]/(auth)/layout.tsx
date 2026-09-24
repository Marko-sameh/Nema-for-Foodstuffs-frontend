import { Link } from '@/i18n/navigation';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-md mb-8 flex justify-center">
        <Link href="/" className="font-bold text-4xl text-primary">
          Ne'ma
        </Link>
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
