'use client';
import { cookie3Config } from '@/const/cookie3';
import { Cookie3Provider } from '@/providers/Cookie3Provider';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { cookie3Analytics } from '@cookie3/analytics';
import type { Resource } from 'i18next';
import { type PropsWithChildren } from 'react';
import { Layout } from 'src/Layout';
import { UserTracking } from 'src/UserTracking';
import { defaultNS } from 'src/i18n';
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
    <ReactQueryProvider>
      <ThemeProvider>
        <ArcxAnalyticsProvider
          apiKey={`${process.env.NEXT_PUBLIC_ARCX_API_KEY}`}
        >
          <WalletProvider>
            <UserTracking />
            <Cookie3Provider value={analytics}>
              <TranslationsProvider
                namespaces={[defaultNS]}
                locale={lang}
                resources={i18nResources}
              >
                <Layout>{children}</Layout>
              </TranslationsProvider>
            </Cookie3Provider>
          </WalletProvider>
        </ArcxAnalyticsProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
};
