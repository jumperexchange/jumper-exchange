import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import i18nConfig from 'i18n-config';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { Viewport } from 'next/types';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Suspense, type ReactNode } from 'react';
import { FeatureFlagsBootstrap } from 'src/components/FeatureFlagsBootstrap/FeatureFlagsBootstrap';
import { ReferrerCapture } from 'src/components/ReferrerCapture/ReferrerCapture';
import NavbarWrapper from 'src/components/Navbar/NavbarWrapper';
import { defaultNS, fallbackLng, namespaces } from 'src/i18n';
import { IntercomProvider } from 'src/providers/IntercomProvider';
import { SettingsStoreProvider } from 'src/stores/settings';
import initTranslations from '@/app/i18n';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import config, { getPublicEnvVars } from '@/config/env-config';
import envConfig from '@/config/env-config';
import { getSiteUrl } from '@/const/urls';
import { fonts } from '@/fonts/fonts';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { DefaultThemeProvider } from '@/providers/ThemeProvider/DefaultThemeProvider';
import { MUIThemeProvider } from '@/providers/ThemeProvider/MUIThemeProvider';
import TranslationsProvider from '@/providers/TranslationProvider';
import { WalletProvider } from '@/providers/WalletProvider/WalletProvider';
import { PortfolioProvider } from '@/providers/PortfolioProvider/PortfolioProvider';
import { getMiniAppSettings } from '../lib/getMiniAppSettings';
import {
  baseMiniApp,
  pageMetadataFields,
  pageOpenGraph,
  pageTwitter,
} from '../lib/metadata';
import { getThemeBootstrapInlineScript } from '@/providers/ThemeProvider/getThemeBootstrapInlineScript';
import { ExtensionDetectionProvider } from '@/providers/ExtensionDetectionProvider/ExtensionDetectionProvider';
import { getPocketUniverseHtmlDataCsnSnapshotInlineScript } from '@/providers/ExtensionDetectionProvider/detectors/pocketUniverse/htmlDataCsnDetector';
import { getPostMessageNativeSnapshotInlineScript } from '@/providers/ExtensionDetectionProvider/detectors/pocketUniverse/postMessageProxyDetector';

const PUBLIC_URL = envConfig.NEXT_PUBLIC_SITE_URL as string;
export const metadata: Metadata = {
  title: pageMetadataFields.default.title,
  description: pageMetadataFields.default.description,
  alternates: {
    canonical: `${getSiteUrl()}`,
  },
  openGraph: {
    ...pageOpenGraph.default,
    url: `${getSiteUrl()}`,
  },
  twitter: {
    ...pageTwitter.default,
  },
  icons: {
    // Icons metadata
    icon: [
      {
        url: '/favicon.svg',
        sizes: 'any',
      },
      { url: '/favicon.png' },
      { url: '/favicon.ico' },
    ],
    shortcut: [
      {
        url: '/apple-touch-icon-57x57.png',
        sizes: '57x57',
      },
      {
        url: '/apple-touch-icon-180x180.png',
        sizes: '180x180',
      },
    ],
  },
  other: {
    'fc:miniapp': JSON.stringify({
      version: 'next',
      imageUrl: baseMiniApp.iconUrl,
      button: {
        title: `Launch Jumper`,
        action: {
          type: 'launch_miniapp',
          name: 'Jumper',
          url: PUBLIC_URL,
          splashImageUrl: baseMiniApp.splashImageUrl,
          splashBackgroundColor: baseMiniApp.splashBackgroundColor,
        },
      },
    }),
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

  const [partnerThemes, { appId }, { resources }] = await Promise.all([
    getPartnerThemes().catch(() => ({ data: [] })),
    getMiniAppSettings().catch((e) => {
      console.error(
        'Failed to fetch mini app settings, using default values.',
        e,
      );
      return { appId: '' };
    }),
    initTranslations(lng || fallbackLng, namespaces),
  ]);

  return (
    <html
      lang={lng || fallbackLng}
      suppressHydrationWarning
      className={fonts.map((f) => f.variable).join(' ')}
      style={{ scrollBehavior: 'smooth' }}
    >
      <head>
        <script
          id="extension-detection-postmessage-snapshot"
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: getPostMessageNativeSnapshotInlineScript(),
          }}
        />
        <script
          id="pocket-universe-html-data-csn-snapshot"
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: getPocketUniverseHtmlDataCsnSnapshotInlineScript(),
          }}
        />
        <script
          id="theme-bootstrap"
          data-cfasync="false"
          dangerouslySetInnerHTML={{
            __html: getThemeBootstrapInlineScript(),
          }}
        />
        <meta name="base:app_id" content={appId} />
        <style>
          {`
          /* Loading background: MUI vars with fallbacks to avoid flicker before ThemeProvider mounts */
          /* Light mode */
          :root.light body {
            background-color: var(--jumper-palette-bg-main, #FCFAFF);
          }
          @media (prefers-color-scheme: light) {
            body {
              background-color: var(--jumper-palette-bg-main, #FCFAFF);
            }
          }

          /* Dark mode */
          :root.dark body {
            background-color: var(--jumper-palette-bg-main, #120b1e);
          }
          @media (prefers-color-scheme: dark) {
            body {
              background-color: var(--jumper-palette-bg-main, #120b1e);
            }
          }
`}
        </style>
        <Script
          id="env-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `window._env_ = ${JSON.stringify(getPublicEnvVars())};`,
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <Script
          strategy="lazyOnload"
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
        <Script strategy="lazyOnload" id="addressable-tracker">
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
              s.src = 'https://tag.adrsbl.io/p.js?tid=${config.NEXT_PUBLIC_ADDRESSABLE_TID}';
              var b = d.getElementsByTagName('script')[0];
              b.parentNode.insertBefore(s, b);
            }(window, document);
          `}
        </Script>
      </head>

      <body suppressHydrationWarning>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ReactQueryProvider>
            <TranslationsProvider
              namespaces={[defaultNS]}
              locale={lng}
              resources={resources}
            >
              <DefaultThemeProvider
                themes={partnerThemes.data ?? []}
                activeTheme={'default'}
              >
                <WalletProvider>
                  <MUIThemeProvider>
                    <SettingsStoreProvider>
                      <NuqsAdapter>
                        <PortfolioProvider>
                          <ExtensionDetectionProvider>
                            <Suspense>
                              <ReferrerCapture />
                              <FeatureFlagsBootstrap />
                            </Suspense>
                            <NavbarWrapper />
                            <IntercomProvider />
                            <main>{children}</main>
                          </ExtensionDetectionProvider>
                        </PortfolioProvider>
                      </NuqsAdapter>
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

export function generateStaticParams() {
  return i18nConfig.locales.map((lng) => ({ lng }));
}
