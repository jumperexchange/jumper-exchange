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
  const { activeUid, currentCustomizedTheme } = usePartnerTheme();
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
    if (activeUid && currentCustomizedTheme) {
      console.log('currentCustomizedTheme', currentCustomizedTheme);
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
                : currentTheme.palette.surface1.main,
          },
          accent1Alt: {
            main:
              typeof currentCustomizedTheme.palette?.accent1Alt?.main ===
              'string'
                ? currentCustomizedTheme.palette.accent1Alt.main
                : currentTheme.palette.surface1.main,
          },
          accent2: {
            main:
              typeof currentCustomizedTheme.palette?.accent2?.main === 'string'
                ? currentCustomizedTheme.palette.accent2.main
                : currentTheme.palette.surface1.main,
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
        },
        // typography: currentCustomizedTheme.typography
        //   ? currentCustomizedTheme.typography
        //   : currentTheme.typography,
      });
      return mergedTheme;
    } else {
      return currentTheme;
    }
  }, [activeUid, currentCustomizedTheme, theme]);

  // Render children only when the theme is determined
  return (
    <MuiThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
