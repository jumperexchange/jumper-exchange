'use client';
import { useSettingsStore } from '@/stores/settings';
import type { ThemeModesSupported } from '@/types/settings';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { darkTheme, lightTheme } from 'src/theme/theme';
import { deepmerge } from '@mui/utils';
import { sora } from 'src/fonts/fonts';
import { useSuperfest } from 'src/hooks/useSuperfest';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { usePartnerThemeV2 } from '@/hooks/usePartnerThemeV2';

export const useDetectDarkModePreference = () => {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');
return;
  if (themeMode === 'dark') {
    return true;
  } else if (themeMode === 'light') {
    return false;
  } else {
    return isDarkModeHook;
  }
};

export const ThemeProvider: React.FC<
  PropsWithChildren<{ themeMode?: ThemeModesSupported, activeTheme?: string }>
> = ({ children, themeMode: themeProp, activeTheme: activeThemeProp }) => {
  const [, setCookie] = useCookies(['themeMode']);
  const themeModeFromStore = useSettingsStore((state) => state.themeMode);
  const [themeMode, setThemeMode] = useState<ThemeModesSupported | undefined>(
    themeProp,
  );
  console.log('themeprovider', themeMode)
  const { isSuperfest } = useSuperfest();
  const { isMainPaths } = useMainPaths();
  const { hasTheme, currentCustomizedTheme, availableWidgetThemeMode } =
    usePartnerTheme();
  // const { activeTheme: activeThemeV2 } =
    // usePartnerThemeV2();
  const isDarkMode = useDetectDarkModePreference();

  useEffect(() => {
    // Check if the theme prop is not provided (null or undefined)
    if (themeMode === undefined) {
      setThemeMode(isDarkMode ? 'dark' : 'light');
    }
  }, [themeMode, isDarkMode]);

  // Update the theme whenever themeMode changes
  useEffect(() => {
    if (!!hasTheme && availableWidgetThemeMode) {
      setThemeMode(availableWidgetThemeMode === 'dark' ? 'dark' : 'light');
    } else if (themeModeFromStore === 'auto') {
      setThemeMode(isDarkMode ? 'dark' : 'light');
      setCookie('themeMode', isDarkMode ? 'dark' : 'light', {
        path: '/',
        sameSite: true,
      });
    } else {
      setCookie('themeMode', themeModeFromStore === 'dark' ? 'dark' : 'light', {
        path: '/',
        sameSite: true,
      });
      setThemeMode(themeModeFromStore === 'dark' ? 'dark' : 'light');
    }
  }, [themeModeFromStore, isDarkMode, setCookie, availableWidgetThemeMode]);

  const activeTheme = useMemo(() => {
    let currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

    console.log('activethemv2', activeThemeV2, isSuperfest)

    if (isSuperfest) {
      currentTheme = lightTheme;
      // Merge partner theme attributes into the base theme
      const mergedTheme = deepmerge(currentTheme, {
        components: {
          Background: {
            styleOverrides: {
              root: ({ theme }) => ({
                position: 'fixed',
                backgroundRepeat: 'repeat',
                width: '100%',
                height: '100%',
                backgroundImage: `url(https://strapi.li.finance/uploads/Superfest_OP_9e52e7917e.svg)`,
                overflow: 'hidden',
                pointerEvents: 'none',
                left: 0,
                bottom: 0,
                right: 0,
                top: 0,
                zIndex: -1,
              }),
            },
          },
        },
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
            main: '#ff0420',
          },
          surface1: {
            main: '#FDFBEF',
          },
        },
        // typography: currentCustomizedTheme.typography
        //   ? currentCustomizedTheme.typography
        //   : currentTheme.typography,
      });

      console.log('mergedtheme', mergedTheme?.components?.Background)

      return mergedTheme;
    }

    return;

    // if (activeThemeV2 === 'jumper') {
    //   return lightTheme;
    // }

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
    } else if (isSuperfest || isMainPaths) {
      currentTheme = lightTheme;
      // Merge partner theme attributes into the base theme
      const mergedTheme = deepmerge(currentTheme, {
        components: {
          Background: {
            styleOverrides: {
              root: ({ theme }) => ({
                position: 'fixed',
                backgroundRepeat: 'repeat',
                width: '100%',
                height: '100%',
                backgroundImage: `url(https://strapi.li.finance/uploads/Superfest_OP_9e52e7917e.svg)`,
                overflow: 'hidden',
                pointerEvents: 'none',
                left: 0,
                bottom: 0,
                right: 0,
                top: 0,
                zIndex: -1,
              }),
            },
          },
        },
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
            main: '#ff0420',
          },
          surface1: {
            main: '#FDFBEF',
          },
        },
        // typography: currentCustomizedTheme.typography
        //   ? currentCustomizedTheme.typography
        //   : currentTheme.typography,
      });

      console.log('mergedtheme', mergedTheme?.components?.Background)

      return mergedTheme;
    } else {
      return currentTheme;
    }
  }, [isSuperfest, isMainPaths, hasTheme, currentCustomizedTheme, themeMode, activeThemeV2]);

  // Render children only when the theme is determined
  return (
    <MuiThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
