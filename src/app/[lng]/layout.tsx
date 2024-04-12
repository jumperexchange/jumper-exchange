import { AppProvider } from '@/providers/AppProvider';
import i18nConfig from 'i18nconfig';
import { cookies } from 'next/headers';
import React from 'react';
import { namespaces } from 'src/i18n';
import type { ThemeModesSupported } from 'src/types/settings';
import initTranslations from '../i18n';

export function generateStaticParams() {
  return i18nConfig.locales.map((locale) => ({ locale }));
}
export default async function RootLayout({
  children,
  params: { lng },
  req,
}: {
  children: React.ReactNode;
  params: { lng: string };
  req: any;
}) {
  const { resources } = await initTranslations(lng, namespaces);
  const activeTheme = cookies().get('theme')?.value as
    | ThemeModesSupported
    | undefined;
  return (
    <AppProvider i18nResources={resources} lang={lng} theme={activeTheme}>
      {children}
    </AppProvider>
  );
}
