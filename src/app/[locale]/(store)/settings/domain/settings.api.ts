import { api } from '@/lib/api';

export interface SettingsData {
  shipping_fee: number;
  [key: string]: string | number;
}

export class SettingsAPI {
  static async fetchSettings(): Promise<{ success: boolean; data: SettingsData }> {
    return api.get<{ success: boolean; data: SettingsData }>('/settings');
  }

  static async updateSettings(data: Partial<SettingsData>): Promise<{ success: boolean; data: SettingsData }> {
    return api.patch<{ success: boolean; data: SettingsData }>('/settings/admin', data);
  }
}
