import { api } from '@/lib/api';
import { User } from '@/types/user';
import { LoginFormValues, RegisterFormValues } from '../validation/auth.schema';

export interface AuthResponse {
  user: User;
  token: string;
}

export class AuthAPI {
  static async login(data: LoginFormValues): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', data);
  }

  static async register(data: Omit<RegisterFormValues, 'passwordConfirm'>): Promise<AuthResponse> {
    const nameParts = data.name.trim().split(' ');
    const firstName = nameParts[0] || 'User';
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : firstName;

    const payload = {
      email: data.email,
      phone: data.phone,
      password: data.password,
      firstName,
      lastName,
    };

    return api.post<AuthResponse>('/auth/register', payload);
  }
}

export interface GenericMessageResponse {
  message?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export class PasswordResetAPI {
  static async forgotPassword(data: ForgotPasswordPayload): Promise<GenericMessageResponse> {
    return api.post<GenericMessageResponse>('/auth/forgot-password', data);
  }

  static async resetPassword(data: ResetPasswordPayload): Promise<GenericMessageResponse> {
    return api.post<GenericMessageResponse>('/auth/reset-password', data);
  }
}
