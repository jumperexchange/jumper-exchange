'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { ThemeStoreProvider, useThemeStore } from '@/stores/theme';
import { formatConfig, isDarkOrLightThemeMode } from '@/utils/formatTheme';
import {
  ThemeProvider as MuiThemeProvider,
  useColorScheme,
} from '@mui/material/styles';
import { useEffect, useMemo } from 'react';
import type { ThemeProviderProps } from './types';
import {
  getMuiTheme,
  getPartnerTheme,
  getWidgetTheme,
  getWidgetThemeV2,
} from './utils';
import { useMediaQuery } from '@mui/material';
import { themeCustomized } from 'src/theme/theme';
import { PartnerThemeConfig } from 'src/types/PartnerThemeConfig';
import { ThemeProps } from 'src/types/theme';

export function ThemeProviderBase({ children, themes }: ThemeProviderProps) {
  const { mode, setMode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const metaTheme = useMetaTag('partner-theme');

  const partnerTheme = metaTheme || 'default';

  const themeStore = useMemo((): ThemeProps => {
    const metaElement =
      typeof window !== 'undefined'
        ? document.querySelector('meta[name="partner-theme"]')
        : undefined;

    const widgetTheme = getWidgetThemeV2(
      mode === 'system' || !mode ? (prefersDarkMode ? 'dark' : 'light') : mode,
      partnerTheme,
      themes,
    );

    return {
      configTheme: formatConfig(
        getPartnerTheme(themes, partnerTheme),
      ) as PartnerThemeConfig,
      partnerThemes: themes!,
      widgetTheme: widgetTheme,
    };
  }, [mode, themes]);

  return <ThemeStoreProvider value={themeStore}>{children}</ThemeStoreProvider>;
}
