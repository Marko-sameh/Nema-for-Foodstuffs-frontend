'use client';

import { useState } from 'react';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../hooks/useAdminCategories';
import { CategoryForm } from './CategoryForm';
import { CategoryFormData } from '../validation/category.schema';
import { Category } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { getLocalizedName } from '@/lib/i18n-content';
import Image from 'next/image';

export function AdminCategoriesClient() {
  const t = useTranslations('admin.categories');
  const locale = useLocale();
  const { data, isLoading, isError } = useAdminCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: CategoryFormData) => {
    try {
      if (editingCategory) {
        await updateMutation.mutateAsync({ id: editingCategory.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Handled by mutation hook
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete', { defaultMessage: 'Are you sure you want to delete this category? This might affect products linked to it.' }))) {
      deleteMutation.mutate(id);
    }
  };

  const categories = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
        <h2 className="text-lg font-semibold">{t('manageCategories', { defaultMessage: 'Manage Categories' })}</h2>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> {t('addCategory', { defaultMessage: 'Add Category' })}
        </Button>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table className="w-full text-sm text-start">
            <TableHeader className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <TableRow>
                <TableHead className="px-6 py-4">{t('table.image', { defaultMessage: 'Image' })}</TableHead>
                <TableHead className="px-6 py-4">{t('table.name', { defaultMessage: 'Name' })}</TableHead>
                <TableHead className="px-6 py-4">{t('table.slug', { defaultMessage: 'Slug' })}</TableHead>
                <TableHead className="px-6 py-4 text-center">{t('table.actions', { defaultMessage: 'Actions' })}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="px-6 py-4">
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError || categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    {t('noCategoriesFound', { defaultMessage: 'No categories found. Click "Add Category" to create one.' })}
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="px-6 py-4">
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border relative">
                        {category.imageUrl ? (
                          <Image src={category.imageUrl} alt={getLocalizedName(category, locale)} fill sizes="48px" className="object-cover" />
                        ) : (
                          <span className="font-bold text-muted-foreground">{getLocalizedName(category, locale).charAt(0)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium">{getLocalizedName(category, locale)}</TableCell>
                    <TableCell className="px-6 py-4 font-mono text-xs text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleOpenEdit(category)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(category.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialData={editingCategory}
      />
    </div>
  );
}
