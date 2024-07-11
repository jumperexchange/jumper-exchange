import { AppProvider } from '@/providers/AppProvider';
import i18nConfig from 'i18nconfig';
import React from 'react';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import TranslationsProvider from '@/providers/TranslationProvider';
import initTranslations from '@/app/i18n';
import { TrackingProvider } from '@/providers/TrackingProvider';
import { Layout } from 'src/Layout';

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const { resources } = await initTranslations(lng || fallbackLng, namespaces);

  return (
    <TranslationsProvider
      namespaces={[defaultNS]}
      locale={lng}
      resources={resources}
    >
      <TrackingProvider>
        {/*<AppProvider lang={lng}>*/}
        {children}
        {/*</AppProvider>*/}
      </TrackingProvider>
    </TranslationsProvider>
  );
}

export function generateStaticParams() {
  return i18nConfig.locales.map((lng) => ({ lng }));
}
