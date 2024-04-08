import React from 'react';
import { fallbackLng, namespaces } from 'src/i18n';
import { AppProvider } from 'src/providers/AppProvider';
import initTranslations from '../i18n';

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  console.log('LNG IN LAYOUT:', lng);
  const { resources } = await initTranslations(lng, namespaces);

  return (
    <AppProvider lang={fallbackLng} i18nResources={resources}>
      {children}
    </AppProvider>
  );
}
