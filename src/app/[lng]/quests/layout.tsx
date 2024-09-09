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
      themes={['dark', 'light']}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2 themes={[]}>
        <Layout>{children}</Layout>
      </ThemeProviderV2>
    </NextThemeProvider>
  );
}
