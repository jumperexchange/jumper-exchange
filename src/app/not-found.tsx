import initTranslations from '@/app/i18n';
import Background from '@/components/Background';
import { NotFoundComponent } from '@/components/NotFound/NotFound';
import config from '@/config/env-config';
import { fonts } from '@/fonts/fonts';
import {
  MUIThemeProvider,
  DefaultThemeProvider,
} from '@/providers/ThemeProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Script from 'next/script';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { ReactQueryProvider } from 'src/providers/ReactQueryProvider';
import { SettingsStoreProvider } from 'src/stores/settings/SettingsStore';
import { ServerNavbar } from 'src/components/Navbar/ServerNavbar';

export default async function NotFound() {
  const { resources } = await initTranslations(fallbackLng, namespaces);

  return (
    <html
      lang={fallbackLng}
      suppressHydrationWarning
      className={fonts.map((f) => f.variable).join(' ')}
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="text/javascript" src="/api/env-config.js" />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${config.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}`}
        />
        <Script id="google-analytics">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag() { dataLayer.push(arguments); }
              gtag('js', new Date());
              gtag('config', '${config.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}');
          `}
        </Script>
      </head>

      <body suppressHydrationWarning>
        <AppRouterCacheProvider>
          <ReactQueryProvider>
            <TranslationsProvider
              namespaces={[defaultNS]}
              locale={fallbackLng}
              resources={resources}
            >
              <DefaultThemeProvider themes={[]}>
                <WalletProvider>
                  <MUIThemeProvider>
                    <SettingsStoreProvider welcomeScreenClosed={true}>
                      <Background />
                      <ServerNavbar />
                      <NotFoundComponent />
                    </SettingsStoreProvider>
                  </MUIThemeProvider>
                </WalletProvider>
              </DefaultThemeProvider>
            </TranslationsProvider>
          </ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
