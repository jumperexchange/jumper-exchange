import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { CssBaseline } from '@mui/material';
import { defaultSettings, SettingsProvider } from '@transferto/shared/src';
import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BackgroundGradient } from './components/BackgroundGradient';
import { HistoryMigration } from './components/HistoryMigration';
import { ChainInfosProvider } from './providers/ChainInfosProvider';
import { I18NProvider } from './providers/I18nProvider';
import { MenuProvider } from './providers/MenuProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { WalletProvider } from './providers/WalletProvider';

const queryClient = new QueryClient();

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChainInfosProvider>
        <I18NProvider>
          <SettingsProvider defaultSettings={defaultSettings}>
            <MenuProvider>
              <ThemeProvider>
                <ArcxAnalyticsProvider
                  apiKey={`${import.meta.env.VITE_ARCX_API_KEY}`}
                  config={{
                    trackWalletConnections: false,
                  }}
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
