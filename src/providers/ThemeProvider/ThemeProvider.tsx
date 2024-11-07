'use client';
import { ThemeStoreProvider } from '@/stores/theme';
import type { ThemeMode, ThemeProps } from '@/types/theme';
import { formatConfig, isDarkOrLightThemeMode } from '@/utils/formatTheme';
import { CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import type { PartnerThemeConfig } from 'src/types/PartnerThemeConfig';
import { ThemeProviderBase } from './ThemeProviderBase';
import type { ThemeProviderProps } from './types';
import {
  getEffectiveThemeMode,
  getMuiTheme,
  getPartnerTheme,
  getWidgetTheme,
} from './utils';
import { PartnerTheme, PartnerThemesAttributes } from '@/types/strapi';

/**
 * App's theme provider component.
 * Provider for the MUI theme context, mainly setting up the MUI provider, very linked to the next-theme provider
 */
export function ThemeProvider({
  children,
  activeTheme,
  themes,
  themeMode,
}: ThemeProviderProps) {
  const themeStore = useMemo((): ThemeProps => {
    const metaElement =
      typeof window !== 'undefined'
        ? document.querySelector('meta[name="partner-theme"]')
        : undefined;
    const metaTheme = metaElement?.getAttribute('content');
    const partnerTheme = metaTheme || activeTheme || 'default';
    const isPartnerTheme = themes?.find((d) => d.attributes.uid === partnerTheme);
    const effectiveThemeMode = getEffectiveThemeMode(isPartnerTheme ? isDarkOrLightThemeMode(isPartnerTheme.attributes) : themeMode);

    const widgetTheme = getWidgetTheme(
      getMuiTheme(themes, partnerTheme, effectiveThemeMode),
      partnerTheme,
      themes,
    );
    return {
      activeTheme: activeTheme || 'default',
      themeMode: effectiveThemeMode as ThemeMode,
      configTheme: formatConfig(
        getPartnerTheme(themes, partnerTheme),
      ) as PartnerThemeConfig,
      partnerThemes: themes!,
      widgetTheme: widgetTheme,
    };
  }, [activeTheme, themeMode, themes]);

  return (
    <ThemeStoreProvider value={themeStore}>
      <CssBaseline />
      <ThemeProviderBase activeTheme={activeTheme} themeMode={themeMode}>
        {children}
      </ThemeProviderBase>
    </ThemeStoreProvider>
  );
}
