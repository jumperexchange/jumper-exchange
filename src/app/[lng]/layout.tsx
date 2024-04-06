import Script from 'next/script';
import React from 'react';
import { AppProvider } from 'src/providers/AppProvider';

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  // if (locales.indexOf(lng) < 0) {
  //   lng = fallbackLng;
  // }
  return (
    <html lang={lng}>
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
