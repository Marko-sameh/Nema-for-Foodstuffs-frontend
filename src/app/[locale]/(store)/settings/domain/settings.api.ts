import { api } from '@/lib/api';

export interface SettingsData {
  shipping_fee: number;
  [key: string]: string | number;
}

export class SettingsAPI {
  static async fetchSettings(): Promise<SettingsData> {
    return api.get<SettingsData>('/settings');
  }

  static async updateSettings(data: Partial<SettingsData>): Promise<SettingsData> {
    return api.patch<SettingsData>('/settings/admin', data);
  }
}
