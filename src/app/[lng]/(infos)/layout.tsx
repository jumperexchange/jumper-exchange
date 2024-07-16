import React from 'react';
import { FeatureCards } from '@/components/FeatureCards';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { Layout } from 'src/Layout';
import { ThemeProvider } from 'next-themes';
import { cookies } from 'next/headers';

export default async function PartnerThemeLayout({
  children,
  params: { partnerTheme },
}: {
  children: React.ReactNode;
  params: { partnerTheme: string };
}) {
  const cookies1 = cookies();

  return (
    <ThemeProvider
      themes={['light', 'dark']}
      defaultTheme={'system'}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2
        themes={[]}
        activeTheme={cookies1.get('theme')?.value || 'system'}
      >
        <Layout>{children}</Layout>
        <FeatureCards />
      </ThemeProviderV2>
    </ThemeProvider>
  );
}
