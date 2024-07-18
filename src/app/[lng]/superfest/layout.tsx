import React from 'react';
import { FeatureCards } from '@/components/FeatureCards';
import { getCookies } from '@/app/lib/getCookies';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { cookies } from 'next/headers';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { Layout } from 'src/Layout';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export default async function PartnerThemeLayout({
  children,
  params: { partnerTheme },
}: {
  children: React.ReactNode;
  params: { partnerTheme: string };
}) {
  const partnerThemes = await getPartnerThemes();

  return (
    <NextThemeProvider
      themes={[
        'dark',
        'light',
        ...partnerThemes.data.map((d) => d.attributes.uid),
      ]}
      forcedTheme={'op'}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2 themes={partnerThemes.data}>
        <Layout>{children}</Layout>
        <FeatureCards />
      </ThemeProviderV2>
    </NextThemeProvider>
  );
}
