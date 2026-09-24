'use client';

import { PageHeader } from '@/components/shared/PageHeader';
import { useSettings, useUpdateSettings } from '@/app/[locale]/(store)/settings/hooks/useSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { SettingsData } from '@/app/[locale]/(store)/settings/domain/settings.api';
import { useTranslations } from 'next-intl';

export function AdminSettingsClient() {
  const t = useTranslations('admin.settings');
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();
  const [formData, setFormData] = useState<Partial<SettingsData>>({});

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Only sending shipping_fee for now as it's the main configurable setting
    updateSettings({
      shipping_fee: Number(formData.shipping_fee) || 0,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        title={t('title', { defaultMessage: 'Settings' })}
        description={t('description', { defaultMessage: 'Manage global store configuration and preferences.' })}
        breadcrumbs={[
          { label: t('nav.dashboard', { defaultMessage: 'Dashboard' }), href: '/admin/dashboard' },
          { label: t('nav.settings', { defaultMessage: 'Settings' }) }
        ]}
      />

      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-lg font-bold mb-6">{t('deliverySettings', { defaultMessage: 'Delivery & Shipping Settings' })}</h3>
        
        {isLoading ? (
          <div className="h-20 flex items-center justify-center text-muted-foreground">
            {t('loading', { defaultMessage: 'Loading settings...' })}
          </div>
        ) : (
          <div className="space-y-6 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                {t('defaultShippingFee', { defaultMessage: 'Default Shipping Fee' })}
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.shipping_fee ?? ''}
                onChange={(e) => handleChange('shipping_fee', parseFloat(e.target.value))}
                placeholder="e.g. 15"
              />
              <p className="text-[13px] text-muted-foreground">
                {t('shippingFeeDesc', { defaultMessage: 'This fee will be applied to all customer orders.' })}
              </p>
            </div>

            <Button onClick={handleSave} disabled={isPending || isLoading}>
              {isPending ? t('saving', { defaultMessage: 'Saving...' }) : t('saveSettings', { defaultMessage: 'Save Settings' })}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
