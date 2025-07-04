'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { ThemeStoreProvider } from '@/stores/theme';
import { formatConfig } from '@/utils/formatTheme';
import { useColorScheme } from '@mui/material/styles';
import { useMemo } from 'react';
import type { ThemeProviderProps } from './types';
import { getPartnerTheme, getWidgetThemeV2 } from './utils';
import { useMediaQuery } from '@mui/material';
import { PartnerThemeConfig } from 'src/types/PartnerThemeConfig';
import { ThemeProps } from 'src/types/theme';

export function DefaultThemeProvider({ children, themes }: ThemeProviderProps) {
  const { mode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const metaTheme = useMetaTag('partner-theme');

  const partnerTheme = metaTheme || 'default';

  const themeStore = useMemo((): ThemeProps => {
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
