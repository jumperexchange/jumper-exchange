import React from 'react';
import { FeatureCards } from '@/components/FeatureCards';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { cookies } from 'next/headers';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { Layout } from 'src/Layout';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

export default async function MainLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const partnerThemes = await getPartnerThemes();

  const cookiesHandler = cookies();

  const defaultTheme = 'default';

  return (
    <NextThemeProvider
      themes={[
        'dark',
        'light',
        ...partnerThemes.data.map((d) => d.attributes.uid),
      ]}
      defaultTheme={defaultTheme}
      enableSystem
      enableColorScheme
    >
      <ThemeProviderV2
        activeTheme={cookiesHandler.get('theme')?.value || defaultTheme}
        themes={partnerThemes.data}
      >
        <Layout>{children}</Layout>
        <FeatureCards />
      </ThemeProviderV2>
    </NextThemeProvider>
  );
}
