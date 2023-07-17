import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { BackgroundGradient } from './components/BackgroundGradient';
import { queryClient } from './config/queryClient';
import { ChainInfosProvider } from './providers/ChainInfosProvider';
import { I18NProvider } from './providers/I18nProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { WalletProvider } from './providers/WalletProvider';

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ChainInfosProvider>
        <I18NProvider>
          <ThemeProvider>
            <ArcxAnalyticsProvider
              apiKey={`${import.meta.env.VITE_ARCX_API_KEY}`}
            >
              <WalletProvider>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <BackgroundGradient />
                {children}
              </WalletProvider>
            </ArcxAnalyticsProvider>
          </ThemeProvider>
        </I18NProvider>
      </ChainInfosProvider>
    </QueryClientProvider>
  );
};
