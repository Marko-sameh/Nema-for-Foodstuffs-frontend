import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ADDRESSES_MODULE_CONFIG } from '../module.config';
import { api } from '@/lib/api';
import { ApiResponse } from '@/types/api';
import { Address } from '@/types/user';
import { AddressFormData } from '../validation/address.schema';
import { toast } from 'sonner';



export function useAddresses() {
  return useQuery({
    queryKey: ADDRESSES_MODULE_CONFIG.queryKeys.list(),
    queryFn: async () => {
      return api.get<Address[]>(ADDRESSES_MODULE_CONFIG.endpoints.list);
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddressFormData) => {
      return api.post<Address>(ADDRESSES_MODULE_CONFIG.endpoints.create, data);
    },
    onSuccess: () => {
      toast.success('Address added successfully');
      queryClient.invalidateQueries({ queryKey: ADDRESSES_MODULE_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to add address');
    }
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: AddressFormData }) => {
      return api.put<Address>(ADDRESSES_MODULE_CONFIG.endpoints.update(id), data);
    },
    onSuccess: () => {
      toast.success('Address updated successfully');
      queryClient.invalidateQueries({ queryKey: ADDRESSES_MODULE_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to update address');
    }
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<null>(ADDRESSES_MODULE_CONFIG.endpoints.delete(id));
    },
    onSuccess: () => {
      toast.success('Address deleted successfully');
      queryClient.invalidateQueries({ queryKey: ADDRESSES_MODULE_CONFIG.queryKeys.all });
    },
    onError: () => {
      toast.error('Failed to delete address');
    }
  });
}
