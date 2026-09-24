'use client';

import { useState } from 'react';
import { useAddresses, useCreateAddress, useUpdateAddress, useDeleteAddress } from '../hooks/useAddresses';
import { AddressForm } from './AddressForm';
import { AddressFormData } from '../validation/address.schema';
import { Address } from '@/types/user';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { MapPin, Plus, Edit2, Trash2, MapPinned } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from 'next-intl';

export function AddressListClient() {
  const t = useTranslations('addresses');
  const { data, isLoading, isError } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (address: Address) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  };

  const handleSubmit = async (formData: AddressFormData) => {
    try {
      if (editingAddress) {
        await updateMutation.mutateAsync({ id: editingAddress.id, data: formData });
      } else {
        await createMutation.mutateAsync(formData);
      }
      setIsFormOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('confirmDelete', { defaultMessage: 'Are you sure you want to delete this address?' }))) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const addresses = data || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" /> {t('addAddress', { defaultMessage: 'Add New Address' })}
        </Button>
      </div>

      {addresses.length === 0 || isError ? (
        <EmptyState
          icon={<MapPinned className="w-12 h-12 text-muted-foreground/50" />}
          title={t('empty.title', { defaultMessage: 'No addresses saved' })}
          description={t('empty.description', { defaultMessage: 'Add an address so we know where to deliver your fresh groceries.' })}
          action={<Button onClick={handleOpenCreate}>{t('empty.action', { defaultMessage: 'Add Address' })}</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`bg-card border rounded-xl p-5 relative transition-all ${
                address.isDefault ? 'border-primary ring-1 ring-primary/20 shadow-md' : 'hover:border-primary/50 shadow-sm'
              }`}
            >
              {address.isDefault && (
                <Badge className="absolute top-4 end-4 pointer-events-none">
                  {t('defaultBadge', { defaultMessage: 'Default' })}
                </Badge>
              )}
              
              <div className="flex items-start gap-3">
                <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{address.label}</h3>
                  <div className="text-muted-foreground mt-1 leading-relaxed">
                    <p className="text-sm font-medium mb-1 text-foreground">
                      {address.fullName} • {address.phone}
                    </p>
                    {address.street} <br />
                    {address.city}{address.governorate ? `, ${address.governorate}` : ''} <br />
                    {address.postalCode}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-6 pt-4 border-t">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleOpenEdit(address)}
                  className="flex-1 gap-2"
                >
                  <Edit2 className="w-4 h-4" /> {t('edit', { defaultMessage: 'Edit' })}
                </Button>
                <div className="w-px h-4 bg-border"></div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDelete(address.id)}
                  className="flex-1 gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" /> {t('delete', { defaultMessage: 'Delete' })}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddressForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
        initialData={editingAddress}
      />
    </div>
  );
}
