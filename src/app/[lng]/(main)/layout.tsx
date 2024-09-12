import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { FeatureCards } from '@/components/FeatureCards';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { cookies } from 'next/headers';
import React from 'react';
import { Layout } from 'src/Layout';
import { FingerprintProvider } from 'src/providers/FingerprintProvider';

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

  // provider for the theme context, it is used to provide the theme to the whole app, must be into the layout.tsx or page.tsx.
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
      <FingerprintProvider>
        <ThemeProviderV2
          activeTheme={cookiesHandler.get('theme')?.value || defaultTheme}
          themes={partnerThemes.data}
        >
          <Layout>{children}</Layout>
          <FeatureCards />
        </ThemeProviderV2>
      </FingerprintProvider>
    </NextThemeProvider>
  );
}
