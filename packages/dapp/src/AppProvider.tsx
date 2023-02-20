import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { CssBaseline } from '@mui/material';
import { defaultSettings, SettingsProvider } from '@transferto/shared/src';
import { useEffect } from 'react';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';
import { QueryClient, QueryClientProvider } from 'react-query';
import { HistoryMigration } from './components/HistoryMigration';
import { ChainInfosProvider } from './providers/ChainInfosProvider';
import { I18NProvider } from './providers/I18nProvider';
import { MenuProvider } from './providers/MenuProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { WalletProvider } from './providers/WalletProvider';

import type { PropsWithChildren } from 'react';
import { BackgroundGradient } from './components/BackgroundGradient';

const queryClient = new QueryClient();

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  useEffect(() => {
    ReactGA.initialize(
      (import.meta as any).env.VITE_GOOGLE_ANALYTICS_TRACKING_ID,
    );
    hotjar.initialize(
      (import.meta as any).env.VITE_HOTJAR_ID,
      (import.meta as any).env.VITE_HOTJAR_SNIPPET_VERSION,
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ChainInfosProvider>
        <I18NProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <MenuProvider>
              <ThemeProvider>
                <ArcxAnalyticsProvider
                  apiKey={`${(import.meta as any).env.VITE_ARCX_API_KEY}`}
                >
                  <WalletProvider>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <BackgroundGradient />
                    {children}
                  </WalletProvider>
                </ArcxAnalyticsProvider>
              </ThemeProvider>
            </MenuProvider>
          </SettingsProvider>
        </I18NProvider>
      </ChainInfosProvider>
      <HistoryMigration />
    </QueryClientProvider>
  );
};
