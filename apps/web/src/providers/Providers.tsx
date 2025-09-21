'use client';

import { AuthProvider } from '@/contexts/auth-context';
import { I18nProvider } from '@/contexts/i18n-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <I18nProvider locale="en">
        {children}
      </I18nProvider>
    </AuthProvider>
  );
}