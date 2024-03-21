'use client';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ClientTranslationProvider } from '@/i18n/i18next-client-provider';
import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { CssBaseline } from '@mui/material';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { ReactQueryProvider } from './ReactQueryProvider';
import { ThemeProvider } from './ThemeProvider';
import { WalletProvider } from './WalletProvider';
// import { cookie3Config } from 'src/const';

// todo: enable cookie3
// const analytics = cookie3Analytics(cookie3Config);

interface AppProviderProps {
  lng: string;
}

export const AppProvider: React.FC<PropsWithChildren<AppProviderProps>> = ({
  children,
  lng,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  return isClient ? (
    <ReactQueryProvider>
      <ClientTranslationProvider lng={lng}>
        {/* <Cookie3Provider value={analytics}> */}
        <ArcxAnalyticsProvider
          apiKey={`${process.env.NEXT_PUBLIC_ARCX_API_KEY}`}
        >
          <WalletProvider>
            <ThemeProvider>
              <CssBaseline />
              <BackgroundGradient />
              {/* <ErrorBoundary fallback={<FallbackError />}> */}
              {children}
              {/* </ErrorBoundary> */}
            </ThemeProvider>
          </WalletProvider>
        </ArcxAnalyticsProvider>
        {/* </Cookie3Provider> */}
      </ClientTranslationProvider>
    </ReactQueryProvider>
  ) : null;
};
