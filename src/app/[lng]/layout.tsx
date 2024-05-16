import { AppProvider } from '@/providers/AppProvider';
import i18nConfig from 'i18nconfig';
import React from 'react';
import { namespaces } from 'src/i18n';
import initTranslations from '../i18n';
import { getCookies } from '../lib/getCookies';

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
  req: any;
}) {
  const { resources } = await initTranslations(lng, namespaces);
  const { activeTheme } = getCookies();

  return (
    <AppProvider i18nResources={resources} lang={lng} theme={activeTheme}>
      {children}
    </AppProvider>
  );
}

export function generateStaticParams() {
  return i18nConfig.locales.map((lng) => ({ lng }));
}
