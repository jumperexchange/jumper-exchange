'use client';
import { useMetaTag } from '@/hooks/useMetaTag';
import { useThemeStore } from '@/stores/theme';
import { formatConfig, isDarkOrLightThemeMode } from '@/utils/formatTheme';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';
import type { ThemeProviderProps } from './types';
import {
  getEffectiveThemeMode,
  getMuiTheme,
  getPartnerTheme,
  getWidgetTheme,
} from './utils';

export function ThemeProviderBase({
  children,
  activeTheme,
  themeMode,
}: ThemeProviderProps) {
  const { resolvedTheme } = useNextTheme();
  const [, setCookie] = useCookies(['theme', 'themeMode']);
  const [themes, setConfigTheme, setWidgetTheme] = useThemeStore((state) => [
    state.partnerThemes,
    state.setConfigTheme,
    state.setWidgetTheme,
  ]);

  const metaTheme = useMetaTag('partner-theme');

  const partnerTheme = metaTheme || activeTheme || 'default';
  const isPartnerTheme = themes?.find(
    (d) => d.attributes?.uid === partnerTheme,
  );

  const effectiveThemeMode = getEffectiveThemeMode(
    (isPartnerTheme?.attributes &&
      isDarkOrLightThemeMode(isPartnerTheme?.attributes)) ||
      themeMode,
    resolvedTheme,
  );

  const currentMuiTheme = useMemo(
    () => getMuiTheme(themes, partnerTheme, effectiveThemeMode),
    [effectiveThemeMode, partnerTheme, themes],
  );

  useEffect(() => {
    setWidgetTheme(getWidgetTheme(currentMuiTheme, partnerTheme, themes));
    setConfigTheme(formatConfig(getPartnerTheme(themes, partnerTheme)));
    setCookie('theme', partnerTheme, { path: '/', sameSite: true });
    setCookie('themeMode', effectiveThemeMode, { path: '/', sameSite: true });
  }, [
    currentMuiTheme,
    effectiveThemeMode,
    partnerTheme,
    setConfigTheme,
    setCookie,
    setWidgetTheme,
    themes,
  ]);

  return (
    <MuiThemeProvider theme={currentMuiTheme}>{children}</MuiThemeProvider>
  );
}
