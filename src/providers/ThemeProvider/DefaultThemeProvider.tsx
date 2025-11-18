'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { ThemeStoreProvider } from '@/stores/theme';
import { formatConfig } from '@/utils/formatTheme';
import { useColorScheme } from '@mui/material/styles';
import { useMemo } from 'react';
import type { ThemeProviderProps } from './types';
import { getPartnerTheme, getWidgetThemeV2 } from './utils';
import { useMediaQuery } from '@mui/material';
import type { ThemeProps } from 'src/types/theme';

export function DefaultThemeProvider({ children, themes }: ThemeProviderProps) {
  const { mode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const metaTheme = useMetaTag('partner-theme');

  const partnerTheme = metaTheme || 'default';
  const partnerThemeConfig = getPartnerTheme(themes, partnerTheme);

  const themeStore = useMemo((): ThemeProps => {
    const widgetTheme = getWidgetThemeV2(
      mode === 'system' || !mode ? (prefersDarkMode ? 'dark' : 'light') : mode,
      partnerThemeConfig,
    );

    return {
      configTheme: formatConfig(partnerThemeConfig),
      partnerThemes: themes!,
      widgetTheme: widgetTheme,
    };
  }, [mode, themes, partnerThemeConfig, prefersDarkMode]);

  return <ThemeStoreProvider value={themeStore}>{children}</ThemeStoreProvider>;
}
