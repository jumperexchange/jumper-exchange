import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { CssBaseline } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BackgroundGradient } from './components/BackgroundGradient';
import {
  ChainInfosProvider,
  ContentfulProvider,
  I18NProvider,
  ThemeProvider,
  WalletProvider,
} from './providers';

const queryClient = new QueryClient();

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContentfulProvider>
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
      </ContentfulProvider>
    </QueryClientProvider>
  );
};
