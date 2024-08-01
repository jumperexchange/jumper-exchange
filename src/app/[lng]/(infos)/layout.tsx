import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { cookies } from 'next/headers';
import React from 'react';
import { Layout } from 'src/Layout';

export default async function PartnerThemeLayout({
  children,
  params: { partnerTheme },
}: {
  children: React.ReactNode;
  params: { partnerTheme: string };
}) {
  const cookiesHandler = cookies();

  return (
    <NextThemeProvider
      themes={['light', 'dark']}
      defaultTheme={'system'}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2
        themes={[]}
        activeTheme={cookiesHandler.get('theme')?.value || 'system'}
      >
        <Layout>{children}</Layout>
      </ThemeProviderV2>
    </NextThemeProvider>
  );
}
