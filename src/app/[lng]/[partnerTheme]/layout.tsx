import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { FeatureCards } from '@/components/FeatureCards';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { notFound } from 'next/navigation';
import React from 'react';
import { Layout } from 'src/Layout';

export default async function PartnerThemeLayout({
  children,
  params: { partnerTheme },
}: {
  children: React.ReactNode;
  params: { partnerTheme: string };
}) {
  const partnerThemes = await getPartnerThemes();

  const partnerThemesData = partnerThemes.data?.find(
    (d) => d.attributes.uid === partnerTheme,
  );
  if (!partnerThemesData) {
    return notFound();
  }

  return (
    <NextThemeProvider
      themes={[
        'dark',
        'light',
        ...partnerThemes.data.map((d) => d.attributes.uid),
      ]}
      forcedTheme={partnerThemesData.attributes.uid}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2
        themes={partnerThemes.data}
        activeTheme={partnerThemesData.attributes.uid}
      >
        <Layout disableNavbar={true}>{children}</Layout>
        <FeatureCards />
      </ThemeProviderV2>
    </NextThemeProvider>
  );
}
