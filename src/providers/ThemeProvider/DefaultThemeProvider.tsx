'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { ThemeStoreProvider } from '@/stores/theme';
import { formatConfig, formatTheme } from '@/utils/formatTheme';
import { useColorScheme } from '@mui/material/styles';
import { useMemo } from 'react';
import type { ThemeProviderProps } from './types';
import { getPartnerTheme } from './utils';
import { useMediaQuery } from '@mui/material';
import type { ThemeProps } from 'src/types/theme';
import { getDefaultWidgetThemeV2 } from 'src/config/widgetConfig';
import { deepmerge } from '@mui/utils';

export function DefaultThemeProvider({ children, themes }: ThemeProviderProps) {
  const { mode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const metaTheme = useMetaTag('partner-theme');

  const partnerTheme = metaTheme || 'default';
  const partnerThemeConfig = getPartnerTheme(themes, partnerTheme);

  const themeStore = useMemo((): ThemeProps => {
    // Get formatted partner theme data
    const formatted = partnerThemeConfig
      ? formatTheme(partnerThemeConfig)
      : null;

    // Compute default widget themes for both modes
    const defaultWidgetLight = getDefaultWidgetThemeV2('light');
    const defaultWidgetDark = getDefaultWidgetThemeV2('dark');

    // Compute partner widget themes (merged with defaults)
    const partnerWidgetConfig = formatted?.activeWidgetTheme ?? {};
    const partnerWidgetLight = {
      config: deepmerge(defaultWidgetLight.config, partnerWidgetConfig),
    };
    const partnerWidgetDark = {
      config: deepmerge(defaultWidgetDark.config, partnerWidgetConfig),
    };

    // Compute jumper themes
    const partnerJumperTheme = formatted?.jumperTheme ?? {};

    return {
      configTheme: formatConfig(partnerThemeConfig),
      partnerThemes: themes!,
      widgetTheme: {
        light: defaultWidgetLight,
        dark: defaultWidgetDark,
        partnerLight: partnerWidgetLight,
        partnerDark: partnerWidgetDark,
      },
      jumperTheme: {
        default: {},
        partner: partnerJumperTheme,
      },
      configThemeStates: {},
    };
  }, [mode, themes, partnerThemeConfig, prefersDarkMode]);

  return <ThemeStoreProvider value={themeStore}>{children}</ThemeStoreProvider>;
}
