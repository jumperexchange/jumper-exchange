import initTranslations from '@/app/i18n';
import { getCookies } from '@/app/lib/getCookies';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { type PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { getPartnerThemes } from 'src/app/lib/getPartnerTheme';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { TrackingProvider } from './TrackingProvider';
import TranslationsProvider from './TranslationProvider';

interface AppProviderProps {
  children: React.ReactNode | JSX.Element;
  lang?: string;
  partnerPageUid?: string;
}

export const AppProvider: React.FC<
  PropsWithChildren<AppProviderProps>
> = async ({ children, lang, partnerPageUid }) => {
  const { resources } = await initTranslations(lang || fallbackLng, namespaces);
  const { activeTheme, partnerThemeUid } = getCookies();
  const partnerThemes =
    (partnerPageUid && (await getPartnerThemes(partnerPageUid))) ??
    (partnerThemeUid && (await getPartnerThemes(partnerThemeUid)));
  console.log('AppProvider: CHECK cookie partnerThemeUid', partnerThemeUid);
  console.log('AppProvider: CHECK partnerThemes', partnerThemes);
  return (
    <ThemeProvider
      theme={activeTheme}
      partnerCustomizedTheme={
        (partnerThemes?.data?.length && partnerThemes.data[0].attributes) ||
        undefined
      }
    >
      <TrackingProvider>
        <TranslationsProvider
          namespaces={[defaultNS]}
          locale={lang}
          resources={resources}
        >
          <Layout
            partnerTheme={
              (partnerThemes?.data &&
                partnerThemes.data.length &&
                partnerThemes.data[0].attributes) ||
              undefined
            }
            themeMode={activeTheme}
          >
            {children}
          </Layout>
        </TranslationsProvider>
      </TrackingProvider>
    </ThemeProvider>
  );
};
