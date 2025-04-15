'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { useThemeStore } from '@/stores/theme';
import { formatConfig, isDarkOrLightThemeMode } from '@/utils/formatTheme';
import { ThemeProvider as MuiThemeProvider, useColorScheme } from '@mui/material/styles';
import { useEffect, useMemo } from 'react';
import type { ThemeProviderProps } from './types';
import {
  getEffectiveThemeMode,
  getMuiTheme,
  getPartnerTheme,
  getWidgetTheme,
} from './utils';
import { useMediaQuery } from '@mui/material';
import { themeCustomized } from 'src/theme/theme';

export function ThemeProviderBase({
  children,
  activeTheme
}: ThemeProviderProps) {
  const { mode, setMode } = useColorScheme();
  const [setActiveTheme] = useThemeStore((state) => [state.setActiveTheme])
  const [themes, setConfigTheme, setWidgetTheme] = useThemeStore((state) => [
    state.partnerThemes,
    state.setConfigTheme,
    state.setWidgetTheme,
  ]);

  const metaTheme = useMetaTag('partner-theme');

  const partnerTheme = metaTheme || activeTheme || 'default';
  const isPartnerTheme = themes?.find((d) => d?.uid === partnerTheme);

  const effectiveThemeMode = getEffectiveThemeMode(
    (isPartnerTheme && isDarkOrLightThemeMode(isPartnerTheme)) || mode,
    'default',
  );

  console.log('---', mode)

  const currentMuiTheme = useMemo(
    () => getMuiTheme(themes, partnerTheme, mode),
    [effectiveThemeMode, partnerTheme, themes],
  );

  useEffect(() => {
    setWidgetTheme(getWidgetTheme(currentMuiTheme, partnerTheme, themes));
    setConfigTheme(formatConfig(getPartnerTheme(themes, partnerTheme)));
    setActiveTheme(partnerTheme);
    setMode(effectiveThemeMode);
  }, [
    currentMuiTheme,
    effectiveThemeMode,
    partnerTheme,
    setConfigTheme,
    setWidgetTheme,
    themes,
  ]);

  // useEffect(() => {
  //   setMode('dark');
  // }, [setMode]);

  // TODO: remove this when the bug is fixed


  console.log('themeCustomized', themeCustomized);

  return (
    <MuiThemeProvider
     modeStorageKey="jumper-mode"
     theme={themeCustomized}>
      {children}
      </MuiThemeProvider>
  );
}
