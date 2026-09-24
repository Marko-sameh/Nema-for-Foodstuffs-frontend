'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CategoryFormData, categorySchema } from '../validation/category.schema';
import { FormField } from '@/components/forms/FormField';
import { ImageUploadField } from '@/components/forms/ImageUploadField';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Category } from '@/types/product';
import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  isSubmitting: boolean;
  initialData?: Category | null;
}

export function CategoryForm({ isOpen, onClose, onSubmit, isSubmitting, initialData }: CategoryFormProps) {
  const t = useTranslations('admin.categories');
  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
    },
  });

  // Reset form when opened with new data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || '',
          imageUrl: initialData.imageUrl || '',
        });
      } else {
        form.reset({
          name: '',
          slug: '',
          description: '',
          imageUrl: '',
        });
      }
    }
  }, [isOpen, initialData, form]);

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('name', value);
    
    // Only auto-generate if not editing
    if (!initialData) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      form.setValue('slug', slug, { shouldValidate: true });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? t('form.editCategory', { defaultMessage: 'Edit Category' }) : t('form.addCategory', { defaultMessage: 'Add New Category' })}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField 
              control={form.control} 
              name="name" 
              label={t('form.name', { defaultMessage: 'Category Name' })} 
              placeholder={t('form.namePlaceholder', { defaultMessage: 'e.g. Fresh Fruits' })} 
              // Override onChange to handle auto-slug
              render={({ field }) => (
                <Input 
                  {...field} 
                  onChange={(e) => {
                    field.onChange(e);
                    handleNameChange(e);
                  }}
                  placeholder={t('form.namePlaceholder', { defaultMessage: 'e.g. Fresh Fruits' })}
                />
              )}
            />
            
            <FormField 
              control={form.control} 
              name="slug" 
              label={t('form.slug', { defaultMessage: 'URL Slug' })} 
              placeholder={t('form.slugPlaceholder', { defaultMessage: 'e.g. fresh-fruits' })} 
            />
            
            <FormField 
              control={form.control} 
              name="description" 
              label={t('form.description', { defaultMessage: 'Description (Optional)' })} 
              placeholder={t('form.descriptionPlaceholder', { defaultMessage: 'Brief description of this category' })} 
            />

            <ImageUploadField 
              control={form.control} 
              name="imageUrl" 
              label={t('form.image', { defaultMessage: 'Category Image (Optional)' })} 
              mode="single"
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                {t('form.cancel', { defaultMessage: 'Cancel' })}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('form.saving', { defaultMessage: 'Saving...' }) : t('form.saveCategory', { defaultMessage: 'Save Category' })}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
