'use client';

import { useRouter } from '@/i18n/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { AdminProductForm } from './AdminProductForm';
import { useCreateProduct } from '../hooks/useAdminProducts';
import { AdminProductFormValues } from '../validation/product.schema';
import { useTranslations } from 'next-intl';

export function AdminCreateProductClient() {
  const t = useTranslations('admin.products');
  const router = useRouter();
  const { mutate: createProduct, isPending, error } = useCreateProduct();

  const handleSubmit = (values: AdminProductFormValues) => {
    createProduct(values, {
      onSuccess: () => {
        router.push('/admin/products');
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t('createProduct', { defaultMessage: 'Create Product' })}
        description={t('createProductDesc', { defaultMessage: 'Add a new product to your catalog.' })}
        breadcrumbs={[
          { label: t('nav.dashboard', { defaultMessage: 'Dashboard' }), href: '/admin/dashboard' },
          { label: t('nav.products', { defaultMessage: 'Products' }), href: '/admin/products' },
          { label: t('nav.create', { defaultMessage: 'Create' }) }
        ]}
      />

      <div className="bg-card border rounded-xl p-6">
        <AdminProductForm
          onSubmit={handleSubmit}
          isPending={isPending}
          error={(error as Error)?.message}
        />
      </div>
    </div>
  );
}
