import { ThemeProvider } from '@/providers/ThemeProvider';
import { type PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { TrackingProvider } from './TrackingProvider';
import TranslationsProvider from './TranslationProvider';
import initTranslations from '@/app/i18n';
import { getCookies } from '@/app/lib/getCookies';

interface AppProviderProps {
  children: React.ReactNode | JSX.Element;
  lang?: string;
}

export const AppProvider: React.FC<
  PropsWithChildren<AppProviderProps>
> = async ({ children, lang }) => {
  const { resources } = await initTranslations(lang || fallbackLng, namespaces);
  const { activeTheme } = getCookies();

  return (
    <ThemeProvider theme={activeTheme}>
      <TrackingProvider>
        <TranslationsProvider
          namespaces={[defaultNS]}
          locale={lang}
          resources={resources}
        >
          <Layout>{children}</Layout>
        </TranslationsProvider>
      </TrackingProvider>
    </ThemeProvider>
  );
};
