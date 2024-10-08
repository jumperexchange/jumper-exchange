import React from 'react';
import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { Layout } from 'src/Layout';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { fonts } from '@/fonts/fonts';
import Script from 'next/script';
import { PixelBg } from '@/components/illustrations/PixelBg';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import initTranslations from '@/app/i18n';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  const { resources } = await initTranslations(fallbackLng, namespaces);

  const defaultTheme = 'default';

  // provider for the theme context, it is used to provide the theme to the whole app, must be into the layout.tsx or page.tsx.
  return (
    <html
      lang={fallbackLng}
      suppressHydrationWarning
      className={fonts.map((f) => f.variable).join(' ')}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
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
        <Script id="addressable-tracker">
          {`
            !function(w, d){
              w.__adrsbl = {
                  queue: [],
                  run: function(){
                      this.queue.push(arguments);
                  }
              };
              var s = d.createElement('script');
              s.async = true;
              s.src = 'https://tag.adrsbl.io/p.js?tid=${process.env.NEXT_PUBLIC_ADDRESSABLE_TID}';
              var b = d.getElementsByTagName('script')[0];
              b.parentNode.insertBefore(s, b);
            }(window, document);
          `}
        </Script>
      </head>

      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ReactQueryProvider>
            <WalletProvider>
              <TranslationsProvider
                namespaces={[defaultNS]}
                locale={fallbackLng}
                resources={resources}
              >
                <NextThemeProvider
                  themes={['dark', 'light']}
                  defaultTheme={defaultTheme}
                  enableSystem
                  enableColorScheme
                >
                  <ThemeProviderV2 activeTheme={defaultTheme} themes={[]}>
                    <Layout>{children}</Layout>
                  </ThemeProviderV2>
                </NextThemeProvider>
              </TranslationsProvider>

              <PixelBg />
            </WalletProvider>
          </ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
