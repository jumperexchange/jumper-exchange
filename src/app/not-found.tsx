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
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { cookies } from 'next/headers';
import RouterLink from 'next/link';
import Script from 'next/script';
import { defaultNS, namespaces } from 'src/i18n';
import { ReactQueryProvider } from 'src/providers/ReactQueryProvider';

export default async function NotFound() {
  const cookiesHandler = cookies();
  const locale = cookiesHandler.get('NEXT_LOCALE')?.value ?? 'en';

  const { resources } = await initTranslations(locale, namespaces);

  return (
    <html
      lang={locale}
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
            <NextThemeProvider
              themes={['dark', 'light']}
              forcedTheme={'light'}
              enableSystem
              enableColorScheme
            >
              <ThemeProvider themes={[]}>
                <TranslationsProvider
                  namespaces={[defaultNS]}
                  locale={locale}
                  resources={resources}
                >
                  <WalletProvider>
                    <Background />
                    <NavbarContainer>
                      <Link component={RouterLink} href="/">
                        <Logo />
                      </Link>
                      <NavbarButtons />
                    </NavbarContainer>
                    <NotFoundComponent />
                  </WalletProvider>
                </TranslationsProvider>
              </ThemeProvider>
            </NextThemeProvider>
          </ReactQueryProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
