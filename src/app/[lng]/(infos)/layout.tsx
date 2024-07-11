import React from 'react';
import { FeatureCards } from '@/components/FeatureCards';
import { getCookies } from '@/app/lib/getCookies';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { cookies } from 'next/headers';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { Layout } from 'src/Layout';
import { ThemeProvider } from 'next-themes';

export default async function PartnerThemeLayout({
  children,
  params: { partnerTheme },
}: {
  children: React.ReactNode;
  params: { partnerTheme: string };
}) {
  return (
    <ThemeProvider
      themes={[]}
      defaultTheme={'system'}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2 themes={[]}>
        <Layout>{children}</Layout>
        <FeatureCards />
      </ThemeProviderV2>
    </ThemeProvider>
  );
}
