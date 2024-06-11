import { AppProvider } from '@/providers/AppProvider';
import i18nConfig from 'i18nconfig';
import React from 'react';

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return <AppProvider lang={lng}>{children}</AppProvider>;
}

export function generateStaticParams() {
  return i18nConfig.locales.map((lng) => ({ lng }));
}
