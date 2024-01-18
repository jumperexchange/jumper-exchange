import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { cookie3Analytics } from '@cookie3/analytics';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BackgroundGradient } from './components/BackgroundGradient';
import { FallbackError } from './components/FallbackError';
import { queryClient } from './config/queryClient';
import { cookie3Config } from './const/cookie3';
import {
  Cookie3Provider,
  I18NProvider,
  ThemeProvider,
  WalletProvider,
} from './providers';

const analytics = cookie3Analytics(cookie3Config);

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <I18NProvider>
          <ThemeProvider>
            <Cookie3Provider value={analytics}>
              <ArcxAnalyticsProvider
                apiKey={`${import.meta.env.VITE_ARCX_API_KEY}`}
              >
                <CssBaseline />
                <BackgroundGradient />
                <ErrorBoundary fallback={<FallbackError />}>
                  {children}
                </ErrorBoundary>
              </ArcxAnalyticsProvider>
            </Cookie3Provider>
          </ThemeProvider>
        </I18NProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};
