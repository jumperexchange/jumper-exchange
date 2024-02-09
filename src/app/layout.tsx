import { GoogleAnalytics } from '@next/third-parties/google';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import Script from 'next/script';
import React from 'react';
import { BackgroundGradient } from 'src/components';
import {
  ReactQueryProvider,
  ThemeProvider,
  WalletProvider,
} from 'src/providers';

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  const messages = useMessages();

  // console.log('messages', messages);
  return (
    <html lang={locale}>
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <WalletProvider>
              <NextIntlClientProvider locale={locale} messages={messages}>
                <BackgroundGradient />
                {children}
              </NextIntlClientProvider>{' '}
            </WalletProvider>
          </ThemeProvider>
        </ReactQueryProvider>
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            const cookie3Options = {
            siteId: 403,
            additionalTracking: true
          }

          var _paq = window._paq = window._paq || [];
          (function() {
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.src='https://cdn.cookie3.co/scripts/analytics/latest/cookie3.analytics.min.js'; s.parentNode.insertBefore(g,s);
          })();
         `,
          }}
        />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}
        />
      </body>
    </html>
  );
}
