'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { darkTheme, lightTheme } from 'src/theme';
import { useCookies } from 'react-cookie';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';
import { formatTheme, getAvailableThemeMode } from '@/hooks/usePartnerThemeV2';
import { deepmerge } from '@mui/utils';

function getTheme(themes: any[], activeTheme: string) {
  if (activeTheme === 'dark') {
    return darkTheme;
  } else if (activeTheme === 'light') {
    return lightTheme;
  }

  const theme = themes.find((d) => d.attributes.uid === activeTheme);

  if (!theme) {
    return lightTheme;
  }

  const formattedTheme = formatTheme(theme.attributes);
  const baseTheme =
    getAvailableThemeMode(theme.attributes) === 'light'
      ? lightTheme
      : darkTheme;
  console.log('----trgedsf', formattedTheme);

  return deepmerge(baseTheme, formattedTheme.activeMUITheme);
}

/**
 * Your app's theme provider component.
 * 'use client' is essential for next-themes to work with app-dir.
 */
export function ThemeProviderV2({
  children,
  activeTheme,
  themes,
  ...props
}: any) {
  const { resolvedTheme, forcedTheme, ...props2 } = useTheme();
  const [cookie, setCookie] = useCookies(['tototheme']);
  const [currentTheme, setCurrentTheme] = useState(
    getTheme(themes, forcedTheme || resolvedTheme || activeTheme),
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  console.log('INTHEMEPROVIDERV2', resolvedTheme, activeTheme, props, props2);

  useEffect(() => {
    console.log('TRIGGERME PLEASEEEE', resolvedTheme);
    const themeToUse = forcedTheme || resolvedTheme || activeTheme;
    console.log('themeToUse', themeToUse);

    setCurrentTheme(getTheme(themes, themeToUse));
    setCookie('tototheme', resolvedTheme);
  }, [resolvedTheme]);

  // console.log('--', currentTheme.palette.mode)

  return (
    <>
      <CssBaseline />
      <MuiThemeProvider theme={currentTheme}>{children}</MuiThemeProvider>
    </>
  );
}
