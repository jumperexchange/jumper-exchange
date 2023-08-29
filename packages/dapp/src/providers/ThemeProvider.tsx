import { useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { darkTheme, lightTheme } from '@transferto/shared/src/theme';
import React, { PropsWithChildren, useMemo } from 'react';
import { useUserTracking } from '../hooks';
import { useSettingsStore } from '../stores';

export const useDetectDarkModePreference = () => {
  const themeMode = useSettingsStore((state) => state.themeMode);
  const { trackAttribute } = useUserTracking();

  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');
  if (!themeMode || themeMode === 'auto') {
    if (!themeMode) {
      trackAttribute({
        data: {
          theme: isDarkModeHook ? 'dark' : 'light',
          'default-system-theme': isDarkModeHook ? 'dark' : 'light',
        },
      });
    }
    return isDarkModeHook;
  } else if (themeMode === 'dark') {
    return true;
  } else {
    return false;
  }
};

export const ThemeProvider: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const isDarkMode = useDetectDarkModePreference();

  const activeTheme = useMemo(() => {
    return !!isDarkMode ? darkTheme : lightTheme;
  }, [isDarkMode]);

  return <MuiThemeProvider theme={activeTheme}>{children}</MuiThemeProvider>;
};
