import { axiosInstance } from './axios';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export const api = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const response = await axiosInstance.get<ApiResponse<T>>(url, { params });
    return response.data.data;
  },
  
  getPaginated: async <T>(url: string, params?: any): Promise<PaginatedResponse<T>> => {
    const response = await axiosInstance.get<ApiResponse<PaginatedResponse<T>>>(url, { params });
    return response.data.data as any; // Backend might structure this slightly differently
  },

  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data.data;
  },

  put: async <T>(url: string, data?: any): Promise<T> => {
    const response = await axiosInstance.put<ApiResponse<T>>(url, data);
    return response.data.data;
  },

  patch: async <T>(url: string, data?: any): Promise<T> => {
    const response = await axiosInstance.patch<ApiResponse<T>>(url, data);
    return response.data.data;
  },

  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data.data;
  },
};
