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
  const { activeThemeMode } = getCookies();
  const partnerThemes = await getPartnerThemes();
  const cookies1 = cookies();

  console.log('forcedTheme', partnerTheme)

  return (
      <ThemeProvider
        themes={['dark', 'light', ...partnerThemes.data.map((d) => d.attributes.uid)]}
        forcedTheme={'op2testseb'}
        enableSystem
        enableColorScheme
      >
      <ThemeProviderV2 themes={partnerThemes.data}>
        <Layout>
          {children}
        </Layout>
        <FeatureCards />
      </ThemeProviderV2>
      </ThemeProvider>
  );
}
