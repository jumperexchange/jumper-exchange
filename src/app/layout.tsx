import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import Script from 'next/script';
import React from 'react';
import 'src/fonts/inter.css';
import { fallbackLng } from 'src/i18n';
import { metadata as JumperMetadata } from './lib/metadata';
export const metadata = JumperMetadata;

export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={lng || fallbackLng}>
      <head>
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}`}
        />
        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}');
          `}
        </Script>
      </head>

      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true, key: 'css' }}>
          <ReactQueryProvider>
            <WalletProvider>{children}</WalletProvider>
          </ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
