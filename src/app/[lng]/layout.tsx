import initTranslations from '@/app/i18n';
import { fonts } from '@/fonts/fonts';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import i18nConfig from 'i18n-config';
import type { Metadata } from 'next';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import Script from 'next/script';
import type { Viewport } from 'next/types';
import type { ReactNode } from 'react';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { SettingsStoreProvider } from 'src/stores/settings';
import { description, siteName, title } from '../lib/metadata';
import { getSiteUrl } from '@/const/urls';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${getSiteUrl()}`,
  },
  openGraph: {
    title: title,
    description,
    siteName,
    url: `${getSiteUrl()}`,
    images: [
      {
        url: 'https://jumper.exchange/preview.png', // Default image
        width: 900,
        height: 450,
      },
    ],
    type: 'website', // Override type
  },
  twitter: {
    // Twitter metadata
    // cardType: 'summary_large_image',
    site: '@JumperExchange',
    title: title, // Twitter title
    description,
    images: 'https://jumper.exchange/preview.png', // Twitter image
  },
  icons: {
    // Icons metadata
    icon: [
      {
        url: '/favicon_DT.svg',
        sizes: 'any',
        media: '(prefers-color-scheme: dark)',
      },
      { url: '/favicon_DT.png', media: '(prefers-color-scheme: dark)' },
      { url: '/favicon_DT.ico', media: '(prefers-color-scheme: dark)' },
      {
        url: '/favicon.svg',
        sizes: 'any',
        media: '(prefers-color-scheme: light)',
      },
      { url: '/favicon.png', media: '(prefers-color-scheme: light)' },
      { url: '/favicon.ico', media: '(prefers-color-scheme: light)' },
    ],
    shortcut: [
      {
        url: '/apple-touch-icon-57x57.png',
        sizes: '57x57',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/apple-touch-icon-180x180.png',
        sizes: '180x180',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/apple-touch-icon-57x57_DT.png',
        sizes: '57x57',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/apple-touch-icon-180x180_DT.png',
        sizes: '180x180',
        media: '(prefers-color-scheme: dark)',
      },
    ],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};

type Params = Promise<{ lng: string }>;

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Params;
}) {
  const { lng } = await params;

  /** old
/*
   const cookiesHandler = await cookies();
   const [resourcesPromise, activeThemePromise] = await Promise.allSettled([
    initTranslations(lng || fallbackLng, namespaces),
    getActiveTheme(cookiesHandler),
  ]);*/
  /*

  const { activeTheme, themes, themeMode, isPartnerTheme } =
    activeThemePromise.status === 'fulfilled'
      ? activeThemePromise.value
      : ({} as ActiveThemeResult);

  const resources =
    resourcesPromise.status === 'fulfilled'
      ? resourcesPromise.value.resources
      : undefined;
*/

  const partnerThemes = await getPartnerThemes();

  /** new*/
  const { resources } = await initTranslations(lng || fallbackLng, namespaces);
  /** end new*/

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
      <InitColorSchemeScript attribute="class" />
      <AppRouterCacheProvider options={{ enableCssLayer: false }}>
          <ReactQueryProvider>
            <TranslationsProvider
              namespaces={[defaultNS]}
              locale={lng}
              resources={resources}
            >
              <NextThemeProvider enableSystem enableColorScheme>
                <ThemeProvider
                  themes={partnerThemes.data}
                  activeTheme={'default'}
                  themeMode={'system'}
                >
                  <SettingsStoreProvider welcomeScreenClosed={true}>
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
