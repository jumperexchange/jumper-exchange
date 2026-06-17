import type { Decorator } from '@storybook/react';
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
import { useColorScheme } from '@mui/material/styles';

const mockThemes = [];

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

  useEffect(() => {
    if (i18n) {
      document.documentElement.setAttribute('lang', activeLocale);
    }
  }, [activeLocale, i18n]);

  if (!i18n) return <div>Loading...</div>;

  const activeTheme = context.globals.theme === 'dark' ? 'dark' : 'light';

  return (
    <NuqsAdapter>
      <ReactQueryProvider>
        <I18nextProvider key={activeLocale} i18n={i18n}>
          <DefaultThemeProvider themes={mockThemes} activeTheme={activeTheme}>
            <WalletProvider>
              <MUIThemeProvider>
                <SettingsStoreProvider>
                  <ThemeBridge theme={activeTheme}>
                    <Story {...context} />
                  </ThemeBridge>
                </SettingsStoreProvider>
              </MUIThemeProvider>
            </WalletProvider>
          </DefaultThemeProvider>
        </I18nextProvider>
      </ReactQueryProvider>
    </NuqsAdapter>
  );
};
