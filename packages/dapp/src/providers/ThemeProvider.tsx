import { useMediaQuery } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { useSettingsStore } from '@transferto/shared/src/contexts/SettingsContext';
import { darkTheme, lightTheme } from '@transferto/shared/src/theme';
import { SettingsContextProps } from '@transferto/shared/src/types/settings';
import React, { PropsWithChildren, useMemo } from 'react';

export const useDetectDarkModePreference = () => {
  const themeMode = useSettingsStore(
    (state: SettingsContextProps) => state.themeMode,
  );

  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');
  if (!themeMode || themeMode === 'auto') {
    return !!isDarkModeHook ? true : false;
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
