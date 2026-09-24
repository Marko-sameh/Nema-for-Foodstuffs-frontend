import axios from 'axios';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // important for httpOnly cookies
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const sessionId = useCartStore.getState().sessionId;
    if (sessionId && config.headers) {
      config.headers['x-session-id'] = sessionId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post('/api/auth/refresh');
        const { accessToken } = res.data;

        useAuthStore.getState().setToken(accessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        processQueue(null, accessToken);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        
        if (typeof window !== 'undefined') {
          const pathname = window.location.pathname;
          const localeMatch = pathname.match(/^\/(ar|en)/);
          const locale = localeMatch ? localeMatch[1] : 'en';
          window.location.href = `/${locale}/login`;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
