import React from 'react';
import { FeatureCards } from '@/components/FeatureCards';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { cookies } from 'next/headers';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { Layout } from 'src/Layout';
import { ThemeProvider } from 'next-themes';

export default async function MainLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const partnerThemes = await getPartnerThemes();
  const cookies1 = cookies();

  const defaultTheme = 'op2testseb';

  return (
    <ThemeProvider
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
        activeTheme={cookies1.get('theme')?.value || defaultTheme}
        themes={partnerThemes.data}
      >
        <Layout>{children}</Layout>
        <FeatureCards />
      </ThemeProviderV2>
    </ThemeProvider>
  );
}
