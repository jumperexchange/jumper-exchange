'use client';

import { useSettingsStore } from '@/stores/settings';
import type { PartnerThemesData } from '@/types/strapi';
import {
  formatConfig,
  formatTheme,
  getAvailableThemeModes,
} from '@/utils/formatTheme';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { darkTheme, lightTheme } from 'src/theme';

function getPartnerTheme(themes: PartnerThemesData[], activeTheme?: string) {
  return themes?.find((d) => d.attributes.uid === activeTheme)?.attributes;
}

function getMuiTheme(themes: PartnerThemesData[], activeTheme?: string) {
  if (activeTheme && ['dark', 'system'].includes(activeTheme)) {
    return darkTheme;
  } else if (activeTheme === 'light') {
    return lightTheme;
  }

  const partnerTheme = getPartnerTheme(themes, activeTheme);

  if (!partnerTheme) {
    return lightTheme;
  }

  const formattedTheme = formatTheme(partnerTheme);
  const baseTheme = getAvailableThemeModes(partnerTheme).includes('light')
    ? lightTheme
    : darkTheme;

  return deepmerge(baseTheme, formattedTheme.activeMUITheme);
}

interface ThemeProviderV2Props {
  children: React.ReactNode;
  activeTheme?: string;
  themes: PartnerThemesData[];
}

/**
 * Your app's theme provider component.
 * provider for the MUI theme context, mainly setting up the MUI provider, very linked to the next-theme provider
 */
export function ThemeProviderV2({
  children,
  activeTheme,
  themes,
}: ThemeProviderV2Props) {
  const { resolvedTheme, forcedTheme } = useTheme();
  const [, setCookie] = useCookies(['theme']);
  const [, setPartnerThemes] = useSettingsStore((state) => [
    state.partnerThemes,
    state.setPartnerThemes,
  ]);
  const setConfigTheme = useSettingsStore((state) => state.setConfigTheme);

  const themeToUse = forcedTheme || activeTheme;

  const [currentTheme, setCurrentTheme] = useState(
    getMuiTheme(themes, themeToUse),
  );

  const [, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setPartnerThemes(themes);
  }, []); // todo: check dep array

  useEffect(() => {
    const themeToUse = forcedTheme || resolvedTheme || activeTheme;

    setCurrentTheme(getMuiTheme(themes, themeToUse));
    setConfigTheme(formatConfig(getPartnerTheme(themes, themeToUse)));
    setCookie('theme', themeToUse, { path: '/', sameSite: true });
  }, [resolvedTheme]); // todo: check dep array

  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
    </>
  );
}
