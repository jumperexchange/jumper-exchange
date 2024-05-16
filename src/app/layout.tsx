import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import Script from 'next/script';
import type { Viewport } from 'next/types';
import React from 'react';
import { fallbackLng } from 'src/i18n';
import { metadata as JumperMetadata } from './lib/metadata';
export const metadata = JumperMetadata;

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={fallbackLng}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ReactQueryProvider>
            <WalletProvider>{children}</WalletProvider>
          </ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
