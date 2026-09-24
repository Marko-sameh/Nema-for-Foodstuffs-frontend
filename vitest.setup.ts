import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
import React from 'react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  NextIntlClientProvider: ({ children }: { children: React.ReactNode }) => children,
}));
