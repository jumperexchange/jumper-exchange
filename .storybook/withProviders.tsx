import type { StoryContext } from '@storybook/react';
import type { Resource } from 'i18next';
import { type ReactNode, useEffect, useState } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryProvider } from '../src/providers/ReactQueryProvider';
import { DefaultThemeProvider } from '../src/providers/ThemeProvider/DefaultThemeProvider';
import { MUIThemeProvider } from '../src/providers/ThemeProvider/MUIThemeProvider';
import TranslationsProvider from '../src/providers/TranslationProvider';
import { WalletProvider } from '../src/providers/WalletProvider/WalletProvider';
import { SettingsStoreProvider } from '../src/stores/settings';
import initTranslations from '../src/app/i18n';
import { defaultNS, fallbackLng, namespaces } from '../src/i18n';
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

export const withProviders = (
  Story: () => ReactNode,
  context: StoryContext,
) => {
  const [resources, setResources] = useState<Resource | null>(null);

  const activeLocale = (context.globals.locale as string) || fallbackLng;

  useEffect(() => {
    let cancelled = false;
    setResources(null);
    (async () => {
      const { resources } = await initTranslations(activeLocale, namespaces);
      if (!cancelled) setResources(resources);
    })();
    return () => {
      cancelled = true;
    };
  }, [activeLocale]);

  if (!resources) return <div>Loading...</div>;

  const activeTheme = context.globals.theme === 'dark' ? 'dark' : 'light';

  return (
    <NuqsAdapter>
      <ReactQueryProvider>
        <TranslationsProvider
          key={activeLocale}
          namespaces={[defaultNS]}
          locale={activeLocale}
          resources={resources}
        >
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
        </TranslationsProvider>
      </ReactQueryProvider>
    </NuqsAdapter>
  );
};
