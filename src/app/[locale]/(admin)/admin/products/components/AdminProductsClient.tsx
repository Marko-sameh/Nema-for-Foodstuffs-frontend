'use client';

import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Product } from '@/types/product';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/shared/PageHeader';
import { SearchInput } from '@/components/shared/SearchInput';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useAdminProducts, useDeleteProducts } from '../hooks/useAdminProducts';
import { AdminProductListParams } from '../types/admin-product.types';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { useLocaleFormat } from '@/lib/use-locale-format';
import { useLocale } from 'next-intl';
import { getLocalizedName } from '@/lib/i18n-content';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { Pagination } from '@/components/shared/Pagination';

export function AdminProductsClient() {
  const { formatPrice } = useLocaleFormat();
  const locale = useLocale();
  const t = useTranslations('admin.products');
  
  // State for filtering and pagination
  const [params, setParams] = useState<AdminProductListParams>({ page: 1, limit: 10 });
  
  // Selection state for bulk actions
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Queries and mutations
  const { data, isLoading } = useAdminProducts(params);
  const { mutate: deleteProducts, isPending: isDeleting } = useDeleteProducts();

  const handleDelete = () => {
    const ids = selectedProducts.map(p => p.id);
    deleteProducts(ids, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setSelectedProducts([]);
      }
    });
  };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: t('table.product', { defaultMessage: 'Product' }),
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{getLocalizedName(row.original, locale)}</span>
          <span className="text-xs text-muted-foreground">{row.original.sku}</span>
        </div>
      )
    },
    {
      accessorKey: 'unitType',
      header: t('table.type', { defaultMessage: 'Type' }),
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.unitType === 'WEIGHT' ? t('table.byWeight', { defaultMessage: 'By Weight' }) : t('table.byPiece', { defaultMessage: 'By Piece' })}
        </span>
      )
    },
    {
      id: 'price',
      header: t('table.price', { defaultMessage: 'Price' }),
      cell: ({ row }) => {
        const p = row.original;
        return (
          <span className="font-medium">
            {p.unitType === 'WEIGHT' ? `${formatPrice(p.pricePerKg ?? 0)}/kg` : formatPrice(p.fixedPrice ?? 0)}
          </span>
        );
      }
    },
    {
      accessorKey: 'stockInGrams',
      header: t('table.stock', { defaultMessage: 'Stock' }),
      cell: ({ row }) => {
        const stock = row.original.stockInGrams;
        return (
          <span className={stock < 1000 ? 'text-destructive font-medium' : ''}>
            {row.original.unitType === 'WEIGHT' ? `${(stock / 1000).toFixed(2)} kg` : `${stock} pcs`}
          </span>
        );
      }
    },
    {
      accessorKey: 'isActive',
      header: t('table.status', { defaultMessage: 'Status' }),
      cell: ({ row }) => (
        <StatusBadge 
          label={row.original.isActive ? t('table.active', { defaultMessage: 'Active' }) : t('table.inactive', { defaultMessage: 'Inactive' })} 
          variant={row.original.isActive ? 'success' : 'neutral'} 
        />
      )
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 justify-end">
          <Link href={`/admin/products/${row.original.id}/edit`}>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )
    }
  ];

  return (
    <div>
      <PageHeader
        title={t('title', { defaultMessage: 'Products' })}
        description={t('manageProductsDesc', { defaultMessage: 'Manage your product catalog, pricing, and stock.' })}
        actions={
          <Link href="/admin/products/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t('addProduct', { defaultMessage: 'Add Product' })}
            </Button>
          </Link>
        }
      />

      <div className="flex items-center justify-between gap-4 mb-6">
        <SearchInput
          placeholder={t('searchPlaceholder', { defaultMessage: 'Search products by name or SKU...' })}
          className="max-w-sm w-full"
          value={params.search}
          onChange={(search) => setParams(p => ({ ...p, search, page: 1 }))}
        />
        
        {selectedProducts.length > 0 && (
          <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-lg border">
            <span className="text-sm font-medium">{selectedProducts.length} {t('selected', { defaultMessage: 'selected' })}</span>
            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-2"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              {t('deleteSelected', { defaultMessage: 'Delete Selected' })}
            </Button>
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        selectable
        onSelectionChange={setSelectedProducts}
        emptyMessage={t('noProductsFound', { defaultMessage: 'No products found. Adjust your search or add a new product.' })}
      />

      {data && data.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between px-2">
          <span className="text-sm text-muted-foreground">
            {t('pageInfo', { defaultMessage: 'Page {page} of {totalPages}', page: params.page ?? 1, totalPages: data.totalPages })}
          </span>
          <Pagination 
            page={params.page ?? 1} 
            totalPages={data.totalPages} 
            onPageChange={(p) => setParams(prev => ({ ...prev, page: p }))} 
          />
        </div>
      )}

      <ConfirmDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={t('deleteProducts', { defaultMessage: 'Delete Products' })}
        description={t('confirmDelete', { defaultMessage: 'Are you sure you want to delete {count} product(s)? This action cannot be undone.', count: selectedProducts.length })}
        confirmLabel={t('delete', { defaultMessage: 'Delete' })}
        onConfirm={handleDelete}
        isPending={isDeleting}
      />
    </div>
  );
}
