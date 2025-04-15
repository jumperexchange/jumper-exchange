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
  getEffectiveThemeMode,
  getMuiTheme,
  getPartnerTheme,
  getWidgetTheme,
  getWidgetThemeV2
} from './utils';
import { useMediaQuery } from '@mui/material';
import { themeCustomized } from 'src/theme/theme';
import { PartnerThemeConfig } from 'src/types/PartnerThemeConfig';
import { ThemeProps } from 'src/types/theme';

export function ThemeProviderBase({
  children,
  themes,
}: ThemeProviderProps) {
  const { mode, setMode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // const [setActiveTheme] = useThemeStore((state) => [state.setActiveTheme]);
  // const [setConfigTheme, setWidgetTheme] = useThemeStore((state) => [
  //   state.setConfigTheme,
  //   state.setWidgetTheme,
  // ]);

  console.log('canIgetmode', mode)

  const metaTheme = useMetaTag('partner-theme');

  const partnerTheme = metaTheme || 'default';
  const isPartnerTheme = themes?.find((d) => d?.uid === partnerTheme);

  console.log('---', mode);

  // const currentMuiTheme = useMemo(
  //   () => getMuiTheme(themes, partnerTheme, mode),
  //   [effectiveThemeMode, partnerTheme, themes],
  // );

/*   useEffect(() => {
    console.log('rerender widge theme')
    setWidgetTheme(getWidgetThemeV2(
      mode === 'system' || !mode ? prefersDarkMode ? 'dark' : 'light' : mode,
      partnerTheme,
      themes,
    ));
    // setConfigTheme(formatConfig(getPartnerTheme(themes, partnerTheme)));
    // setActiveTheme(partnerTheme);
    // setMode(mode);
  }, [
    mode,
    partnerTheme,
    themes,
  ]); */

  const themeStore = useMemo((): ThemeProps => {
    const metaElement =
      typeof window !== 'undefined'
        ? document.querySelector('meta[name="partner-theme"]')
        : undefined;
    const metaTheme = metaElement?.getAttribute('content');
    // const partnerTheme = metaTheme || activeTheme || 'default';
    // const isPartnerTheme = themes?.find((d) => d?.uid === partnerTheme);

    console.log('mode to setup', mode, prefersDarkMode, mode === 'system' || !mode ? prefersDarkMode ? 'dark' : 'light' : mode)

    const widgetTheme = getWidgetThemeV2(
      mode === 'system' || !mode ? prefersDarkMode ? 'dark' : 'light' : mode,
      partnerTheme,
      themes,
    );

    console.log('RERENDER TO', widgetTheme.config.appearance)
    console.log('widgetTheme', widgetTheme);
    return {
      // activeTheme: activeTheme || 'default',
      // themeMode: effectiveThemeMode as ThemeMode,
      configTheme: formatConfig(
        getPartnerTheme(themes, partnerTheme),
      ) as PartnerThemeConfig,
      partnerThemes: themes!,
      widgetTheme: widgetTheme,
    };
  }, [
    // activeTheme,
    mode,
    themes,
  ]);

  // useEffect(() => {
  //   setMode('dark');
  // }, [setMode]);

  // TODO: remove this when the bug is fixed
  console.log('themeCustomized', themeStore.widgetTheme);

  return (
    <ThemeStoreProvider value={themeStore}>
        {children}
    </ThemeStoreProvider>
  );
}
