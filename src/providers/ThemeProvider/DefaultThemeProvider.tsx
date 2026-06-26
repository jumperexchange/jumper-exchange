'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { ThemeStoreProvider } from '@/stores/theme';
import { buildInitialConfigThemeStates } from '@/stores/theme/createThemeStore';
import { formatConfig, formatTheme } from '@/utils/formatTheme';
import { useMemo, useLayoutEffect } from 'react';
import type { ThemeProviderProps } from './types';
import { getPartnerTheme } from './utils';
import { applySelectedPartnerColorMode } from './partnerThemeMode';
import type { ThemeProps } from 'src/types/theme';
import { getDefaultWidgetThemeV2 } from 'src/config/widgetConfig';
import { deepmerge } from '@mui/utils';

export function DefaultThemeProvider({
  children,
  themes,
  overrideMetaTheme,
}: ThemeProviderProps) {
  const metaTheme = useMetaTag('partner-theme');
  const activeRoutePartnerUid = overrideMetaTheme ?? metaTheme;

  const partnerThemeConfig = useMemo(() => {
    if (!activeRoutePartnerUid) {
      return getPartnerTheme(themes, 'default');
    }

    const matched = getPartnerTheme(themes, activeRoutePartnerUid);
    if (matched) {
      return matched;
    }

    // Meta uid not in Strapi — treat as no route partner theme; fall back to default.
    return getPartnerTheme(themes, 'default');
  }, [activeRoutePartnerUid, themes]);

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
    const routeConfig = formatConfig(partnerThemeConfig);
    const configThemeStates = buildInitialConfigThemeStates(
      routeConfig,
      themes ?? [],
    );

    return {
      configTheme: routeConfig,
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
      configThemeStates,
    };
  }, [themes, partnerThemeConfig]);

  useLayoutEffect(() => {
    applySelectedPartnerColorMode(themeStore.configThemeStates, themes ?? []);
  }, [themeStore.configThemeStates, themes]);

  return <ThemeStoreProvider value={themeStore}>{children}</ThemeStoreProvider>;
}
