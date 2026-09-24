'use client';

import { useRouter } from '@/i18n/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import { AdminProductForm } from './AdminProductForm';
import { useAdminProductDetail, useUpdateProduct } from '../hooks/useAdminProducts';
import { AdminProductFormValues } from '../validation/product.schema';
import { PageLoading } from '@/components/shared/LoadingState';
import { useTranslations } from 'next-intl';

interface AdminEditProductClientProps {
  productId: string;
}

export function AdminEditProductClient({ productId }: AdminEditProductClientProps) {
  const t = useTranslations('admin.products');
  const router = useRouter();
  const { data: product, isLoading } = useAdminProductDetail(productId);
  const { mutate: updateProduct, isPending, error } = useUpdateProduct(productId);

  const handleSubmit = (values: AdminProductFormValues) => {
    updateProduct(values, {
      onSuccess: () => {
        router.push('/admin/products');
      }
    });
  };

  if (isLoading) return <PageLoading />;
  if (!product) return <div>{t('productNotFound', { defaultMessage: 'Product not found' })}</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader
        title={t('editProduct', { defaultMessage: 'Edit Product' })}
        description={t('editProductDesc', { defaultMessage: 'Update details for {name}.', name: product.name })}
        breadcrumbs={[
          { label: t('nav.dashboard', { defaultMessage: 'Dashboard' }), href: '/admin/dashboard' },
          { label: t('nav.products', { defaultMessage: 'Products' }), href: '/admin/products' },
          { label: t('nav.edit', { defaultMessage: 'Edit' }) }
        ]}
      />

      <div className="bg-card border rounded-xl p-6">
        <AdminProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isPending={isPending}
          error={(error as Error)?.message}
        />
      </div>
    </div>
  );
}
