import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { cookie3Analytics } from '@cookie3/analytics';
import { CssBaseline } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { FallbackError } from 'src/components';
import { queryClient } from 'src/config';
import { cookie3Config } from 'src/const/cookie3';
import { useCookie3, useInitUserTracking } from 'src/hooks';

import {
  Cookie3Provider,
  I18NProvider,
  ThemeProvider,
  WalletProvider,
  EventCollectorProvider,
} from '.';

const analytics = cookie3Analytics(cookie3Config);

export const AppProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const { initTracking } = useInitUserTracking();
  const cookie3 = useCookie3();

  useEffect(() => {
    initTracking({});
    cookie3?.trackPageView();
  }, [cookie3, initTracking]);

  return (
    <QueryClientProvider client={queryClient}>
      <I18NProvider>
        <Cookie3Provider value={analytics}>
          <ArcxAnalyticsProvider
            apiKey={`${import.meta.env.VITE_ARCX_API_KEY}`}
          >
            <ThemeProvider>
              <WalletProvider>
                <EventCollectorProvider>
                  <CssBaseline />
                  <ErrorBoundary fallback={<FallbackError />}>
                    {children}
                  </ErrorBoundary>
                </EventCollectorProvider>
              </WalletProvider>
            </ThemeProvider>
          </ArcxAnalyticsProvider>
        </Cookie3Provider>
      </I18NProvider>
    </QueryClientProvider>
  );
};
