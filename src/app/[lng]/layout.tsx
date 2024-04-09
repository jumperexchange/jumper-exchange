import { AppProvider } from '@/providers/AppProvider';
import i18nConfig from 'i18nconfig';
import React from 'react';
import { namespaces } from 'src/i18n';
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

  return (
    <AppProvider i18nResources={resources} lang={lng}>
      {children}
    </AppProvider>
  );
}
