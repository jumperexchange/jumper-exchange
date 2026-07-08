import initTranslations from '@/app/i18n';
import Background from '@/components/Background';
import { NotFoundComponent } from '@/components/NotFound/NotFound';
import config, { getPublicEnvVars } from '@/config/env-config';
import { fonts } from '@/fonts/fonts';
import { DefaultThemeProvider } from '@/providers/ThemeProvider/DefaultThemeProvider';
import { MUIThemeProvider } from '@/providers/ThemeProvider/MUIThemeProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import { WalletProvider } from '@/providers/WalletProvider/WalletProvider';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import Script from 'next/script';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { ReactQueryProvider } from 'src/providers/ReactQueryProvider';
import { SettingsStoreProvider } from 'src/stores/settings/SettingsStore';
import { ServerNavbar } from 'src/components/Navbar/ServerNavbar';
import { getPartnerThemes } from './lib/getPartnerThemes';
import { getThemeBootstrapInlineScript } from '@/providers/ThemeProvider/getThemeBootstrapInlineScript';

export default async function NotFound() {
  const { resources } = await initTranslations(fallbackLng, namespaces);
  const partnerThemes = await getPartnerThemes().catch(() => ({ data: [] }));

  return (
    <html
      lang={fallbackLng}
      suppressHydrationWarning
      className={fonts.map((f) => f.variable).join(' ')}
    >
      <head>
        <script
          id="theme-bootstrap"
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: getThemeBootstrapInlineScript(),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Script
          id="env-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window._env_ = ${JSON.stringify(getPublicEnvVars())};`,
          }}
        />
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
              <DefaultThemeProvider
                themes={partnerThemes.data ?? []}
                activeTheme={'default'}
              >
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
