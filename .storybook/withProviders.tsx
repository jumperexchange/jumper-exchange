import type { i18n as I18nInstance } from 'i18next';
import { type ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryProvider } from '../src/providers/ReactQueryProvider';
import { DefaultThemeProvider } from '../src/providers/ThemeProvider/DefaultThemeProvider';
import { MUIThemeProvider } from '../src/providers/ThemeProvider/MUIThemeProvider';
import { WalletProvider } from '../src/providers/WalletProvider/WalletProvider';
import { SettingsStoreProvider } from '../src/stores/settings';
import initTranslations from '../src/app/i18n';
import { fallbackLng, namespaces } from '../src/i18n';
import { STRAPI_PARTNER_THEMES } from '../src/const/strapiContentKeys';
import { useStrapi } from '../src/hooks/useStrapi';
import type { PartnerThemesData } from '../src/types/strapi';
import { useColorScheme } from '@mui/material/styles';
import { PartnerThemeBridge } from './PartnerThemeBridge';
import {
  isNoPartnerThemeUid,
  NO_PARTNER_THEME_UID,
} from './partnerThemeConstants.ts';
import { Decorator } from '@storybook/nextjs-vite';

const ThemeBridge = ({
  children,
  theme,
}: {
  children: ReactNode;
  theme: string;
}) => {
  const { setMode } = useColorScheme();

  useEffect(() => {
    setMode(theme === 'dark' ? 'dark' : 'light');
  }, [theme, setMode]);

  return <>{children}</>;
};

interface StorybookProvidersProps {
  Story: Parameters<Decorator>[0];
  context: Parameters<Decorator>[1];
  i18n: I18nInstance;
}

const StorybookProviders = ({
  Story,
  context,
  i18n,
}: StorybookProvidersProps) => {
  const activeLocale = (context.globals.locale as string) || fallbackLng;
  const partnerThemeUid =
    (context.globals.partnerTheme as string) || NO_PARTNER_THEME_UID;
  const standardColorMode =
    context.globals.theme === 'dark' ? 'dark' : ('light' as const);

  const { data: partnerThemes = [], isLoading: partnerThemesLoading } =
    useStrapi<PartnerThemesData>({
      contentType: STRAPI_PARTNER_THEMES,
      queryKey: ['partner-themes', 'storybook'],
    });

  useEffect(() => {
    document.documentElement.setAttribute('lang', activeLocale);
  }, [activeLocale]);

  if (partnerThemesLoading) {
    return <div>Loading partner themes…</div>;
  }

  const overrideMetaTheme = isNoPartnerThemeUid(partnerThemeUid)
    ? undefined
    : partnerThemeUid;

  return (
    <NuqsAdapter>
      <I18nextProvider key={activeLocale} i18n={i18n}>
        <DefaultThemeProvider
          key={`${partnerThemeUid}-${activeLocale}`}
          themes={partnerThemes}
          overrideMetaTheme={overrideMetaTheme}
        >
          <WalletProvider>
            <MUIThemeProvider>
              <SettingsStoreProvider>
                <PartnerThemeBridge
                  partnerThemeUid={partnerThemeUid}
                  standardColorMode={standardColorMode}
                  partnerThemes={partnerThemes}
                />
                {isNoPartnerThemeUid(partnerThemeUid) ? (
                  <ThemeBridge theme={standardColorMode}>
                    <Story {...context} />
                  </ThemeBridge>
                ) : (
                  <Story {...context} />
                )}
              </SettingsStoreProvider>
            </MUIThemeProvider>
          </WalletProvider>
        </DefaultThemeProvider>
      </I18nextProvider>
    </NuqsAdapter>
  );
};

export const withProviders: Decorator = (Story, context) => {
  const [i18n, setI18n] = useState<I18nInstance | null>(null);
  const activeLocale = (context.globals.locale as string) || fallbackLng;

  useEffect(() => {
    let cancelled = false;
    setI18n(null);
    (async () => {
      const { i18n } = await initTranslations(activeLocale, namespaces);
      if (!cancelled) setI18n(i18n);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeLocale]);

  if (!i18n) return <div>Loading...</div>;

  return (
    <ReactQueryProvider>
      <StorybookProviders Story={Story} context={context} i18n={i18n} />
    </ReactQueryProvider>
  );
};
