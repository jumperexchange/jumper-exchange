import React, { type ReactNode } from 'react';
import { Layout } from 'src/Layout';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { fonts } from '@/fonts/fonts';
import Script from 'next/script';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import initTranslations from '@/app/i18n';
import { cookies } from 'next/headers';
import { type ActiveThemeResult, getActiveTheme } from '@/app/lib/getActiveTheme';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { SettingsStoreProvider } from '@/stores/settings';

// TODO: Need to be de-duplicated
export default async function RootLayout({
  children,
  params: { lng },
}: {
  children: ReactNode;
  params: { lng: string };
}) {
  const cookiesHandler = cookies();
  const [resourcesPromise, activeThemePromise] = await Promise.allSettled([
    initTranslations(lng || fallbackLng, namespaces),
    getActiveTheme(cookiesHandler),
  ]);

  const { activeTheme, themes, themeMode, isPartnerTheme } =
    activeThemePromise.status === 'fulfilled'
      ? activeThemePromise.value
      : ({} as ActiveThemeResult);

  const resources =
    resourcesPromise.status === 'fulfilled'
      ? resourcesPromise.value.resources
      : undefined;

  // Welcome Screen is always closed on partner themes
  const welcomeScreenClosed =
    isPartnerTheme ||
    cookiesHandler.get('welcomeScreenClosed')?.value === 'true';

  return (
    <html
      lang={lng || fallbackLng}
      suppressHydrationWarning
      className={fonts.map((f) => f.variable).join(' ')}
      style={{ scrollBehavior: 'smooth' }}
    >
    <head>
      <link rel="icon" href="/favicon.ico" sizes="any" />
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
        <TranslationsProvider
          namespaces={[defaultNS]}
          locale={lng}
          resources={resources}
        >
          <NextThemeProvider enableSystem enableColorScheme>
            <ThemeProvider
              themes={themes}
              activeTheme={activeTheme}
              themeMode={themeMode}
            >
              <SettingsStoreProvider
                welcomeScreenClosed={welcomeScreenClosed}
              >
                <WalletProvider>{children}</WalletProvider>
              </SettingsStoreProvider>
            </ThemeProvider>
          </NextThemeProvider>
        </TranslationsProvider>
      </ReactQueryProvider>
    </AppRouterCacheProvider>
    </body>
    </html>
  );
}
