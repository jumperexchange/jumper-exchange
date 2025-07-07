import React, { ReactNode, useEffect, useState } from 'react';
import { ReactQueryProvider } from '../src/providers/ReactQueryProvider';
import {
  DefaultThemeProvider,
  MUIThemeProvider,
} from '../src/providers/ThemeProvider';
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
  children: React.ReactNode;
  theme: string;
}) => {
  const { setMode } = useColorScheme();

  useEffect(() => {
    setMode(theme === 'dark' ? 'dark' : 'light');
  }, [theme, setMode]);

  return <>{children}</>;
};

export const withProviders = (Story: () => ReactNode, context) => {
  const [resources, setResources] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const { resources } = await initTranslations(fallbackLng, namespaces);
      setResources(resources);
    })();
  }, []);

  if (!resources) return <div>Loading...</div>;

  const activeTheme = context.globals.theme === 'dark' ? 'dark' : 'light';

  return (
    <ReactQueryProvider>
      <TranslationsProvider
        namespaces={[defaultNS]}
        locale={fallbackLng}
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
  );
};
