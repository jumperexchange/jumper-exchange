import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { type PropsWithChildren, useEffect, useState } from 'react';
import { Layout } from 'src/Layout';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { TrackingProvider } from './TrackingProvider';
import TranslationsProvider from './TranslationProvider';
import initTranslations from '@/app/i18n';
import { getCookies } from '@/app/lib/getCookies';
import ThemeToggles from '@/components/ThemeToggles';
import { cookies } from 'next/headers';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';

interface AppProviderProps {
  children: React.ReactNode | JSX.Element;
  lang?: string;
}

export const AppProvider: React.FC<
  PropsWithChildren<AppProviderProps>
> = async ({ children, lang }) => {
  const { activeThemeMode } = getCookies();
  const s = await getPartnerThemes();
  const cookies1 = cookies();

  return (
    <ThemeProviderV2
      activeTheme={cookies1.get('tototheme')?.value}
      themes={s.data}
    >
      {/*<ThemeProvider themeMode={activeThemeMode}>*/}
      {children}
      {/*</ThemeProvider>*/}
    </ThemeProviderV2>
  );
};
