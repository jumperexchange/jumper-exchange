'use client';

import { useSettingsStore } from '@/stores/settings';
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

function getPartnerTheme(themes: any[], activeTheme: string) {
  return themes?.find((d) => d.attributes.uid === activeTheme)?.attributes;
}

function getMuiTheme(themes: any[], activeTheme: string) {
  if (['dark', 'system'].includes(activeTheme)) {
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

/**
 * Your app's theme provider component.
 * 'use client' is essential for next-themes to work with app-dir.
 */
export function ThemeProviderV2({ children, activeTheme, themes }: any) {
  const { resolvedTheme, forcedTheme, ...props2 } = useTheme();
  const [cookie, setCookie] = useCookies(['theme']);
  const [partnerThemes, setPartnerThemes] = useSettingsStore((state) => [
    state.partnerThemes,
    state.setPartnerThemes,
    state.setActiveTheme,
  ]);
  const [configTheme, setConfigTheme] = useSettingsStore((state) => [
    state.configTheme,
    state.setConfigTheme,
  ]);

  const themeToUse = forcedTheme || activeTheme;

  const [currentTheme, setCurrentTheme] = useState(
    getMuiTheme(themes, themeToUse),
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    setPartnerThemes(themes);
  }, []);

  useEffect(() => {
    const themeToUse = forcedTheme || resolvedTheme || activeTheme;

    setCurrentTheme(getMuiTheme(themes, themeToUse));
    setConfigTheme(formatConfig(getPartnerTheme(themes, themeToUse)));
    setCookie('theme', themeToUse, { path: '/', sameSite: true });
  }, [resolvedTheme]);

  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
    </>
  );
}
