import { ThemeProvider } from 'next-themes';
import React from 'react';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';

export default async function ThemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const partnerThemes = await getPartnerThemes();
  console.log('cookiesHandler', partnerThemes.data.map((d) => d.attributes.uid));

  return (
    <ThemeProvider themes={['dark', 'light', ...partnerThemes.data.map((d) => d.attributes.uid)]}
                   enableSystem
                   enableColorScheme
                   >
      {children}
    < /ThemeProvider>
  );
}
