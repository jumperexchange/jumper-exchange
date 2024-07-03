'use client';
import { useSettingsStore } from '@/stores/settings';
import type { ThemeModesSupported } from '@/types/settings';
import { CssBaseline, useMediaQuery } from '@mui/material';
import type { Theme } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { sora } from 'src/fonts/fonts';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';
import { darkTheme, lightTheme } from 'src/theme/theme';
import type { PartnerThemesData, StrapiResponseData } from 'src/types/strapi';

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
  PropsWithChildren<{
    theme?: ThemeModesSupported | 'auto';
    partnerCustomizedTheme?:
      | PartnerThemesData
      | StrapiResponseData<PartnerThemesData>;
  }>
> = ({ children, theme: themeProp, partnerCustomizedTheme }) => {
  const [, setCookie] = useCookies(['theme']);
  const { currentCustomizedTheme, imgUrl, backgroundColor } = usePartnerTheme(
    partnerCustomizedTheme,
  );
  const themeMode = useSettingsStore((state) => state.themeMode);
  const [themeModeState, setThemeModeState] = useState<
    ThemeModesSupported | undefined
  >(themeProp);
  const isDarkMode = useDetectDarkModePreference();
  const { availableThemeMode } = usePartnerTheme();
  // console.log('themeProp', themeProp);
  // console.log('partnerCustomizedTheme', partnerCustomizedTheme);
  // console.log('currentCustomizedTheme', currentCustomizedTheme);
  console.log('TEST backgroundColor', backgroundColor);
  // Update the themeModeState whenever themeMode changes
  useEffect(() => {
    if (availableThemeMode === 'auto' || themeMode === 'auto') {
      setThemeModeState(isDarkMode ? 'dark' : 'light');
      setCookie('theme', isDarkMode ? 'dark' : 'light', {
        path: '/',
        sameSite: true,
      });
    } else {
      setCookie(
        'theme',
        availableThemeMode === 'dark' || themeMode === 'dark'
          ? 'dark'
          : 'light',
        {
          path: '/',
          sameSite: true,
        },
      );
      setThemeModeState(themeMode === 'dark' ? 'dark' : 'light');
    }
  }, [
    themeMode,
    isDarkMode,
    setCookie,
    partnerCustomizedTheme,
    availableThemeMode,
  ]);

  const activeTheme = useMemo(() => {
    let currentTheme = themeModeState === 'dark' ? darkTheme : lightTheme;
    if (currentCustomizedTheme) {
      // Merge partner themeModeState attributes into the base themeModeState
      const mergedTheme = deepmerge(currentTheme, {
        typography: {
          fontFamily:
            currentCustomizedTheme?.typography &&
            currentTheme.typography.fontFamily &&
            currentCustomizedTheme?.typography?.includes('Sora')
              ? sora.style.fontFamily.concat(currentTheme.typography.fontFamily)
              : currentTheme.typography.fontFamily,
        },
        components: {
          Background: {
            styleOverrides: {
              // the slot name defined in the `slot` and `overridesResolver` parameters
              // of the `styled` API
              root: (theme: Theme) => ({
                backgroundColor:
                  backgroundColor || currentTheme.palette.secondary.main,
                ...(imgUrl && { background: `url('${imgUrl}')` }),
                position: 'fixed',
                left: 0,
                bottom: 0,
                right: 0,
                top: 0,
                zIndex: -1,
                overflow: 'hidden',
                pointerEvents: 'none',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',

                // background: 'red',
              }),
            },
          },
        },
        palette: {
          primary: {
            main:
              currentCustomizedTheme?.palette?.primary?.main ||
              currentTheme.palette.primary.main,
          },
          secondary: {
            main:
              currentCustomizedTheme?.palette?.secondary?.main ||
              currentTheme.palette.secondary.main,
          },
          accent1: {
            main:
              currentCustomizedTheme?.palette?.accent1?.main ||
              currentTheme.palette.surface1.main,
          },
          accent1Alt: {
            main:
              currentCustomizedTheme?.palette?.accent1Alt?.main ||
              currentTheme.palette.surface1.main,
          },
          accent2: {
            main:
              currentCustomizedTheme?.palette?.accent2?.main ||
              currentTheme.palette.surface1.main,
          },
          surface1: {
            main:
              currentCustomizedTheme?.palette?.surface1?.main ||
              currentTheme.palette.surface1.main,
          },
          surface2: {
            main:
              currentCustomizedTheme?.palette?.surface2?.main ||
              currentTheme.palette.surface2.main,
          },
          bg: {
            main: backgroundColor || currentTheme.palette.bg.main,
          },
        },
        // typography: currentCustomizedTheme?.typography
        //   ? currentCustomizedTheme?.typography
        //   : currentTheme.typography,
      });
      return mergedTheme;
    } else {
      return currentTheme;
    }
  }, [themeModeState, currentCustomizedTheme, imgUrl]);

  // Render children only when the themeModeState is determined
  return (
    <MuiThemeProvider theme={activeTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
