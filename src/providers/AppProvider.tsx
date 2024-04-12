import { cookie3Config } from '@/const/cookie3';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { cookie3Analytics } from '@cookie3/analytics';
import type { Resource } from 'i18next';
import { type PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { defaultNS } from 'src/i18n';
import { TrackingProvider } from './TrackingProvider';
import TranslationsProvider from './TranslationProvider';

interface AppProviderProps {
  children: React.ReactNode | JSX.Element;
  i18nResources: Resource;
  lang?: string;
}

export const AppProvider: React.FC<PropsWithChildren<AppProviderProps>> = ({
  children,
  i18nResources,
  lang,
}) => {
  const analytics = cookie3Analytics(cookie3Config);

  return (
    <ThemeProvider>
      <TrackingProvider>
        <TranslationsProvider
          namespaces={[defaultNS]}
          locale={lang}
          resources={i18nResources}
        >
          <Layout>{children}</Layout>
        </TranslationsProvider>
      </TrackingProvider>
    </ThemeProvider>
  );
};
