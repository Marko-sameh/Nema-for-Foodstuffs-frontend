import { useMutation } from '@tanstack/react-query';
import { AuthAPI, PasswordResetAPI } from '../domain/auth.api';
import { LoginFormValues, RegisterFormValues } from '../validation/auth.schema';
import { useAuthStore } from '@/store/authStore';

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginFormValues) => AuthAPI.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: RegisterFormValues) => {
      const { passwordConfirm, ...rest } = data;
      return AuthAPI.register(rest);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) => PasswordResetAPI.forgotPassword(data),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; newPassword: string }) => PasswordResetAPI.resetPassword(data),
  });
}
