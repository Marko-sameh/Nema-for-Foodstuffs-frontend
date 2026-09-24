import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SettingsAPI, SettingsData } from '../domain/settings.api';
import { toast } from 'sonner';

export function useSettings() {
  return useQuery({
    queryKey: ['store-settings'],
    queryFn: async () => {
      const response = await SettingsAPI.fetchSettings();
      return response.data; // Ensure we extract the data property
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes since settings rarely change
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<SettingsData>) => SettingsAPI.updateSettings(data),
    onSuccess: () => {
      toast.success('Settings updated successfully');
      queryClient.invalidateQueries({ queryKey: ['store-settings'] });
    },
    onError: () => {
      toast.error('Failed to update settings');
    },
  });
}
