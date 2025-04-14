'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { useThemeStore } from '@/stores/theme';
import { formatConfig, isDarkOrLightThemeMode } from '@/utils/formatTheme';
import { ThemeProvider as MuiThemeProvider, useColorScheme } from '@mui/material/styles';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useMemo } from 'react';
import type { ThemeProviderProps } from './types';
import {
  getEffectiveThemeMode,
  getMuiTheme,
  getPartnerTheme,
  getWidgetTheme,
} from './utils';
import { useMediaQuery } from '@mui/material';

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

  const currentMuiTheme = useMemo(
    () => getMuiTheme(themes, partnerTheme, effectiveThemeMode),
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

  return (
    <MuiThemeProvider theme={currentMuiTheme}>
      {children}
      </MuiThemeProvider>
  );
}
