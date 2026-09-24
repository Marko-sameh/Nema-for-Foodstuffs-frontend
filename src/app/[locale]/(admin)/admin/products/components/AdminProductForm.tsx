'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminProductSchema, AdminProductFormValues } from '../validation/product.schema';
import { Form } from '@/components/ui/form';
import { FormField } from '@/components/forms/FormField';
import { SelectField } from '@/components/forms/SelectField';
import { SwitchField } from '@/components/forms/SwitchField';
import { FormError } from '@/components/forms/FormError';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Product } from '@/types/product';
import { useEffect } from 'react';

import { useAdminCategories } from '../../categories/hooks/useAdminCategories';
import { useTranslations } from 'next-intl';

interface AdminProductFormProps {
  initialData?: Product;
  onSubmit: (values: AdminProductFormValues) => void;
  isPending?: boolean;
  error?: string;
}

export function AdminProductForm({ initialData, onSubmit, isPending, error }: AdminProductFormProps) {
  const t = useTranslations('admin.products');
  const isEditMode = !!initialData;
  const { data: categories, isLoading: categoriesLoading } = useAdminCategories();

  const form = useForm<AdminProductFormValues>({
    resolver: zodResolver(adminProductSchema),
    defaultValues: {
      name: '',
      sku: '',
      description: '',
      categoryId: '',
      brand: '',
      unitType: 'WEIGHT',
      stockInGrams: 0,
      isFeatured: false,
      isActive: true,
      thumbnailUrl: '',
    },
  });

  // Populate form in edit mode
  useEffect(() => {
    if (initialData) {
      form.reset({
        name: initialData.name,
        sku: initialData.sku,
        description: initialData.description ?? '',
        categoryId: initialData.category?.id ?? '',
        brand: initialData.brand ?? '',
        unitType: initialData.unitType,
        pricePerKg: initialData.pricePerKg ?? undefined,
        fixedPrice: initialData.fixedPrice ?? undefined,
        stockInGrams: initialData.stockInGrams,
        isFeatured: initialData.isFeatured,
        isActive: initialData.isActive,
        thumbnailUrl: initialData.thumbnailUrl ?? '',
      });
    }
  }, [initialData, form]);

  // Auto-generate SKU if creating
  const name = form.watch('name');
  useEffect(() => {
    if (!isEditMode && name && !form.getValues('sku')) {
      const generatedSku = name.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);
      form.setValue('sku', generatedSku);
    }
  }, [name, isEditMode, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormError message={error} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <FormField control={form.control} name="name" label={t('form.name', { defaultMessage: 'Product Name' })} />
          <FormField control={form.control} name="sku" label={t('form.sku', { defaultMessage: 'SKU' })} />
          <FormField control={form.control} name="brand" label={t('form.brand', { defaultMessage: 'Brand (Optional)' })} />
          <SelectField
            control={form.control}
            name="categoryId"
            label={t('form.category', { defaultMessage: 'Category' })}
            placeholder={t('form.categoryPlaceholder', { defaultMessage: 'Please select a category' })}
            disabled={categoriesLoading}
            options={categories?.data.map((cat) => ({ label: cat.name, value: cat.id })) || []}
          />
          <FormField
            control={form.control}
            name="pricePerKg"
            label={t('form.pricePerKg', { defaultMessage: 'Price per Kg' })}
            render={(field) => (
              <Input
                type="number"
                step="0.01"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(isNaN(e.target.valueAsNumber) ? undefined : e.target.valueAsNumber)}
              />
            )}
          />
          <FormField
            control={form.control}
            name="fixedPrice"
            label={t('form.fixedPrice', { defaultMessage: 'Fixed Price (Piece)' })}
            render={(field) => (
              <Input
                type="number"
                step="0.01"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(isNaN(e.target.valueAsNumber) ? undefined : e.target.valueAsNumber)}
              />
            )}
          />
          <FormField
            control={form.control}
            name="stockInGrams"
            label={t('form.stock', { defaultMessage: 'Stock (grams)' })}
            render={(field) => (
              <Input
                type="number"
                {...field}
                value={field.value ?? ''}
                onChange={(e) => field.onChange(isNaN(e.target.valueAsNumber) ? undefined : e.target.valueAsNumber)}
              />
            )}
          />
        </div>

        <FormField control={form.control} name="description" label={t('form.description', { defaultMessage: 'Description' })} />
        <FormField control={form.control} name="thumbnailUrl" label={t('form.thumbnailUrl', { defaultMessage: 'Thumbnail URL' })} placeholder="https://example.com/image.jpg" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SwitchField 
            control={form.control} 
            name="isFeatured" 
            label={t('form.featured', { defaultMessage: 'Featured Product' })} 
            description={t('form.featuredDesc', { defaultMessage: 'Display this product on the home page.' })}
          />
          <SwitchField 
            control={form.control} 
            name="isActive" 
            label={t('form.active', { defaultMessage: 'Active' })} 
            description={t('form.activeDesc', { defaultMessage: 'Product is visible to customers.' })}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? t('form.saving', { defaultMessage: 'Saving...' }) : isEditMode ? t('form.updateProduct', { defaultMessage: 'Update Product' }) : t('form.createProduct', { defaultMessage: 'Create Product' })}
          </Button>
        </div>
      </form>
    </Form>
  );
}
