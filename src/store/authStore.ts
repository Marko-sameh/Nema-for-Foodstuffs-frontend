import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

const AUTH_FLAG_COOKIE = 'nema_auth';
const ROLE_COOKIE = 'nema_role';

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function syncAuthCookies(user: User | null) {
  if (user) {
    setCookie(AUTH_FLAG_COOKIE, '1');
    if (user.role === 'ADMIN') {
      setCookie(ROLE_COOKIE, 'admin');
    } else {
      deleteCookie(ROLE_COOKIE);
    }
  } else {
    deleteCookie(AUTH_FLAG_COOKIE);
    deleteCookie(ROLE_COOKIE);
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, accessToken: string) => void;
  setToken: (accessToken: string) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setAuth: (user, accessToken) => {
        syncAuthCookies(user);
        set({ user, accessToken, isAuthenticated: true });
      },
      setToken: (accessToken) => set({ accessToken, isAuthenticated: !!accessToken }),
      logout: async () => {
        const token = get().accessToken;
        try {
          // Attempt backend logout to clear httpOnly cookies
          const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (token) {
            headers['Authorization'] = `Bearer ${token}`;
          }
          await fetch(`${baseURL}/auth/logout`, {
            method: 'POST',
            headers,
            credentials: 'include',
          });
        } catch (error) {
          console.error('Logout request failed:', error);
        } finally {
          syncAuthCookies(null);
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          syncAuthCookies(state.isAuthenticated ? state.user : null);
        }
      },
    }
  )
);
