import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PROFILE_MODULE_CONFIG } from '../module.config';
import { User } from '@/types/user';
import { ProfileFormValues } from '../validation/profile.schema';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_MODULE_CONFIG.queryKeys.profile,
    queryFn: () => api.get<User>(PROFILE_MODULE_CONFIG.endpoints.get),
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setAuth, accessToken } = useAuthStore();

  return useMutation({
    mutationFn: (data: ProfileFormValues) =>
      api.patch<User>(PROFILE_MODULE_CONFIG.endpoints.update, data),
    onSuccess: (user) => {
      // Preserve current token — only update the user object
      if (accessToken) setAuth(user, accessToken);
      queryClient.invalidateQueries({ queryKey: PROFILE_MODULE_CONFIG.queryKeys.profile });
      toast.success('Profile updated successfully');
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });
}
