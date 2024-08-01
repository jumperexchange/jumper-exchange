import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import React from 'react';
import { Layout } from 'src/Layout';

export default async function PartnerThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextThemeProvider
      themes={['light']}
      forcedTheme={'light'}
      enableColorScheme
    >
      <ThemeProviderV2>
        <Layout>{children}</Layout>
      </ThemeProviderV2>
    </NextThemeProvider>
  );
}
