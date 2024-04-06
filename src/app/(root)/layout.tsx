import Script from 'next/script';
import React from 'react';
import { fallbackLng } from 'src/i18n';
import { AppProvider } from 'src/providers/AppProvider';
import { metadata as JumperMetadata } from '../lib/metadata';

export const metadata = JumperMetadata;

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  console.log('LNG IN LAYOUT:', lng);

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
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
