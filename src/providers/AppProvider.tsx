'use client';
import { BackgroundGradient } from '@/components/BackgroundGradient';
import { ArcxAnalyticsProvider } from '@arcxmoney/analytics';
import { CssBaseline } from '@mui/material';
import { useEffect, useState, type PropsWithChildren } from 'react';
import { Navbar } from 'src/components/Navbar/Navbar';
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
    <ArcxAnalyticsProvider apiKey={`${process.env.NEXT_PUBLIC_ARCX_API_KEY}`}>
      <WalletProvider>
        <ThemeProvider>
          <CssBaseline />
          <BackgroundGradient />
          <Navbar />
          {/* <ErrorBoundary fallback={<FallbackError />}> */}
          {children}
          {/* </ErrorBoundary> */}
        </ThemeProvider>
      </WalletProvider>
    </ArcxAnalyticsProvider>
  ) : null;
};
