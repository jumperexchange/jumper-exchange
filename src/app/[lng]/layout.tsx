import initTranslations from '@/app/i18n';
import { fonts } from '@/fonts/fonts';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import i18nConfig from 'i18nconfig';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { cookies } from 'next/headers';
import Script from 'next/script';
import type { Viewport } from 'next/types';
import { type ReactNode } from 'react';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { SettingsStoreProvider } from 'src/stores/settings';
import type { ActiveThemeResult } from '../lib/getActiveTheme';
import { getActiveTheme } from '../lib/getActiveTheme';
import { metadata as JumperMetadata } from '../lib/metadata';

export const metadata = JumperMetadata;

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

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

  const { activeTheme, themes, themeMode } =
    activeThemePromise.status === 'fulfilled'
      ? activeThemePromise.value
      : ({} as ActiveThemeResult);

  const resources =
    resourcesPromise.status === 'fulfilled'
      ? resourcesPromise.value.resources
      : undefined;

  const welcomeScreenClosed =
    cookiesHandler.get('welcomeScreenClosed')?.value === 'true';

  return (
    <html
      lang={lng || fallbackLng}
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

export function generateStaticParams() {
  return i18nConfig.locales.map((lng) => ({ lng }));
}
