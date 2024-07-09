'use client';
import { useSettingsStore } from '@/stores/settings';
import type { ThemeModesSupported } from '@/types/settings';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { sora } from 'src/fonts/fonts';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { useSuperfest } from 'src/hooks/useSuperfest';
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
  const { isSuperfest } = useSuperfest();
  const { isMainPaths } = useMainPaths();
  const { hasTheme, currentCustomizedTheme, availableWidgetThemeMode } =
    usePartnerTheme();
  const isDarkMode = useDetectDarkModePreference();

  useEffect(() => {
    // Check if the theme prop is not provided (null or undefined)
    if (theme === undefined) {
      setTheme(isDarkMode ? 'dark' : 'light');
    }
  }, [theme, isDarkMode]);

  // Update the theme whenever themeMode changes
  useEffect(() => {
    if (!!hasTheme && availableWidgetThemeMode) {
      setTheme(availableWidgetThemeMode === 'dark' ? 'dark' : 'light');
    } else if (themeMode === 'auto') {
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
  }, [themeMode, isDarkMode, setCookie, availableWidgetThemeMode, hasTheme]);

  const activeTheme = useMemo(() => {
    let currentTheme = theme === 'dark' ? darkTheme : lightTheme;
    if (!!hasTheme && currentCustomizedTheme) {
      // Merge partner theme attributes into the base theme
      const mergedTheme = deepmerge(currentTheme, {
        typography: {
          fontFamily:
            currentCustomizedTheme?.typography &&
            currentTheme.typography?.fontFamily &&
            currentCustomizedTheme.typography.fontFamily?.includes('Sora')
              ? sora.style.fontFamily.concat(currentTheme.typography.fontFamily)
              : currentTheme.typography.fontFamily,
        },
        palette: {
          primary: {
            main:
              typeof currentCustomizedTheme.palette?.primary?.main === 'string'
                ? currentCustomizedTheme.palette.primary.main
                : currentTheme.palette.primary.main,
          },
          secondary: {
            main:
              typeof currentCustomizedTheme.palette?.secondary?.main ===
              'string'
                ? currentCustomizedTheme.palette.secondary.main
                : currentTheme.palette.secondary.main,
          },
          accent1: {
            main:
              typeof currentCustomizedTheme.palette?.accent1?.main === 'string'
                ? currentCustomizedTheme.palette.accent1.main
                : currentTheme.palette.accent1.main,
          },
          accent1Alt: {
            main:
              typeof currentCustomizedTheme.palette?.accent1Alt?.main ===
              'string'
                ? currentCustomizedTheme.palette.accent1Alt.main
                : currentTheme.palette.accent1Alt.main,
          },
          accent2: {
            main:
              typeof currentCustomizedTheme.palette?.accent2?.main === 'string'
                ? currentCustomizedTheme.palette.accent2.main
                : currentTheme.palette.accent2.main,
          },
          surface1: {
            main:
              typeof currentCustomizedTheme.palette?.surface1?.main === 'string'
                ? currentCustomizedTheme.palette.surface1.main
                : currentTheme.palette.surface1.main,
          },
          surface2: {
            main:
              typeof currentCustomizedTheme?.palette?.surface2?.main ===
              'string'
                ? currentCustomizedTheme?.palette.surface2.main
                : currentTheme.palette.surface2.main,
          },
          grey: {
            100:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('100')
                ? currentCustomizedTheme?.palette.grey[100]
                : currentTheme.palette.grey[100],
            200:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('200')
                ? currentCustomizedTheme?.palette.grey[200]
                : currentTheme.palette.grey[200],
            300:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('300')
                ? currentCustomizedTheme?.palette.grey[300]
                : currentTheme.palette.grey[300],
            400:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('400')
                ? currentCustomizedTheme?.palette.grey[400]
                : currentTheme.palette.grey[400],
            500:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('500')
                ? currentCustomizedTheme?.palette.grey[500]
                : currentTheme.palette.grey[500],
            600:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('600')
                ? currentCustomizedTheme?.palette.grey[600]
                : currentTheme.palette.grey[600],
            700:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('700')
                ? currentCustomizedTheme?.palette.grey[700]
                : currentTheme.palette.grey[700],
            800:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('800')
                ? currentCustomizedTheme?.palette.grey[800]
                : currentTheme.palette.grey[800],
            900:
              typeof currentCustomizedTheme?.palette?.grey === 'object' &&
              Object.keys(currentCustomizedTheme?.palette?.grey).includes('900')
                ? currentCustomizedTheme?.palette.grey[900]
                : currentTheme.palette.grey[900],
          },
        },
        // typography: currentCustomizedTheme.typography
        //   ? currentCustomizedTheme.typography
        //   : currentTheme.typography,
      });
      return mergedTheme;
    } else if (isSuperfest || isMainPaths) {
      currentTheme = lightTheme;
      // Merge partner theme attributes into the base theme
      const mergedTheme = deepmerge(currentTheme, {
        typography: {
          fontFamily: sora.style.fontFamily,
        },
        palette: {
          primary: {
            main: '#ff0420',
          },
          accent1: {
            main: '#ff0420',
          },
          accent1Alt: {
            main: '#ff0420',
          },
          secondary: {
            main: '#FDFBEF',
          },
          surface1: {
            main: '#FDFBEF',
          },
        },
        // typography: currentCustomizedTheme.typography
        //   ? currentCustomizedTheme.typography
        //   : currentTheme.typography,
      });
      return mergedTheme;
    } else {
      return currentTheme;
    }
  }, [isSuperfest, isMainPaths, hasTheme, currentCustomizedTheme, theme]);

  // Render children only when the theme is determined
  return (
    <MuiThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
