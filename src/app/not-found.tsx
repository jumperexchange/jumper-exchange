import initTranslations from '@/app/i18n';
import Background from '@/components/Background';
import { Logo } from '@/components/Navbar/Logo/Logo';
import { NavbarContainer } from '@/components/Navbar/Navbar.style';
import { NavbarButtons } from '@/components/Navbar/NavbarButtons';
import { NotFoundComponent } from '@/components/NotFound/NotFound';
import { fonts } from '@/fonts/fonts';
import { ThemeProvider } from '@/providers/ThemeProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { Link } from '@mui/material';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import RouterLink from 'next/link';
import Script from 'next/script';
import { ReactQueryProvider } from 'src/providers/ReactQueryProvider';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { SettingsStoreProvider } from 'src/stores/settings/SettingsStore';

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
            <ThemeProvider themes={[]}>
              <TranslationsProvider
                namespaces={[defaultNS]}
                locale={fallbackLng}
                resources={resources}
              >
                <SettingsStoreProvider welcomeScreenClosed={true}>
                  <WalletProvider>
                    <Background />
                    <NavbarContainer enableColorOnDark>
                      <Link component={RouterLink} href="/">
                        <Logo variant="default" />
                      </Link>
                      <NavbarButtons />
                    </NavbarContainer>
                    <NotFoundComponent />
                  </WalletProvider>
                </SettingsStoreProvider>
              </TranslationsProvider>
            </ThemeProvider>
          </ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
