import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { CssBaseline } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { BackgroundGradient, FallbackError } from 'src/components';
import { ClientTranslationProvider } from 'src/i18n';
// import { cookie3Config } from 'src/const';
import {
  ReactQueryProvider,
  ThemeProvider,
  WalletProvider,
} from 'src/providers';

// todo: enable cookie3
// const analytics = cookie3Analytics(cookie3Config);

interface AppProviderProps {
  lng: string;
}

export const AppProvider: React.FC<PropsWithChildren<AppProviderProps>> = ({
  children,
  lng,
}) => {
  return (
    <ReactQueryProvider>
      <ClientTranslationProvider lng={lng}>
        {/* <Cookie3Provider value={analytics}> */}
        <ArcxAnalyticsProvider
          apiKey={`${process.env.NEXT_PUBLIC_ARCX_API_KEY}`}
        >
          <ThemeProvider>
            <WalletProvider>
              <CssBaseline />
              <BackgroundGradient />
              <ErrorBoundary fallback={<FallbackError />}>
                {children}
              </ErrorBoundary>
            </WalletProvider>
          </ThemeProvider>
        </ArcxAnalyticsProvider>
        {/* </Cookie3Provider> */}
      </ClientTranslationProvider>
    </ReactQueryProvider>
  );
};
