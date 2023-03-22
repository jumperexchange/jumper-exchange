import { useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { darkTheme, lightTheme } from '@transferto/shared/src/theme';
import React, { PropsWithChildren, useMemo } from 'react';

export const useDetectDarkModePreference = () => {
  const settings = useSettings();
  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');
  if (!settings.themeMode || settings.themeMode === 'auto') {
    return !!isDarkModeHook ? true : false;
  } else if (settings.themeMode === 'dark') {
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
