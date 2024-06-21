'use client';
import { useSettingsStore } from '@/stores/settings';
import type { ThemeModesSupported } from '@/types/settings';
import { CssBaseline, useMediaQuery } from '@mui/material';
import type { SimplePaletteColorOptions } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { darkTheme, lightTheme } from 'src/theme/theme';

export const useDetectDarkModePreference = () => {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');

  if (themeMode === 'dark') {
    return true;
  } else if (themeMode === 'light') {
    return false;
  } else {
    return isDarkModeHook;
  }
};

export const ThemeProvider: React.FC<
  PropsWithChildren<{ theme?: ThemeModesSupported | 'auto' }>
> = ({ children, theme: themeProp }) => {
  const [, setCookie] = useCookies(['theme']);
  const themeMode = useSettingsStore((state) => state.themeMode);
  const [theme, setTheme] = useState<ThemeModesSupported | undefined>(
    themeProp,
  );
  const isDarkMode = useDetectDarkModePreference();
  const { activeUid, currentWidgetTheme } = usePartnerTheme();
  useEffect(() => {
    // Check if the theme prop is not provided (null or undefined)
    if (theme === undefined) {
      setTheme(isDarkMode ? 'dark' : 'light');
    }
  }, [theme, isDarkMode]);

  // Update the theme whenever themeMode changes
  useEffect(() => {
    if (themeMode === 'auto') {
      setTheme(isDarkMode ? 'dark' : 'light');
      setCookie('theme', isDarkMode ? 'dark' : 'light', {
        path: '/',
        sameSite: true,
      });
    } else {
      setCookie('theme', themeMode === 'dark' ? 'dark' : 'light', {
        path: '/',
        sameSite: true,
      });
      setTheme(themeMode === 'dark' ? 'dark' : 'light');
    }
  }, [themeMode, isDarkMode, setCookie]);

  const activeTheme = useMemo(() => {
    let currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    if (activeUid && currentWidgetTheme) {
      console.log(currentWidgetTheme);
      // Merge partner theme attributes into the base theme
      const mergedTheme = deepmerge(currentTheme, {
        palette: {
          primary: {
            main: currentWidgetTheme.palette?.primary
              ? (
                  currentWidgetTheme.palette
                    ?.primary as SimplePaletteColorOptions
                ).main
              : currentTheme.palette.primary.main,
          },
          secondary: {
            main: currentWidgetTheme.palette?.secondary
              ? (
                  currentWidgetTheme.palette
                    ?.secondary as SimplePaletteColorOptions
                ).main
              : currentTheme.palette.secondary.main,
          },
          surface1: {
            main:
              currentWidgetTheme.palette?.background?.default ||
              currentTheme.palette.secondary.main,
          },
          accent1: {
            main: currentWidgetTheme.palette?.primary
              ? (
                  currentWidgetTheme.palette
                    ?.primary as SimplePaletteColorOptions
                ).main
              : currentTheme.palette.surface1.main,
          },
          accent1Alt: {
            main: currentWidgetTheme.palette?.primary
              ? (
                  currentWidgetTheme.palette
                    ?.primary as SimplePaletteColorOptions
                ).main
              : currentTheme.palette.surface1.main,
          },
          accent2: {
            main: currentWidgetTheme.palette?.secondary
              ? (
                  currentWidgetTheme.palette
                    ?.secondary as SimplePaletteColorOptions
                ).main
              : currentTheme.palette.surface1.main,
          },
        },
        typography: currentWidgetTheme.typography
          ? currentWidgetTheme.typography
          : currentTheme.typography,
      });
      return mergedTheme;
    } else {
      return currentTheme;
    }
  }, [activeUid, currentWidgetTheme, theme]);

  // Render children only when the theme is determined
  return (
    <MuiThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
