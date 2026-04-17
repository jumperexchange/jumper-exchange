'use client';
import { ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import { createTheme } from '@lifi/widget';
import { useWidgetTheme } from '@/hooks/theme/useWidgetTheme';
import {
  THEME_COLOR_SCHEME_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
} from './constants';

export const WalletManagementThemeProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const widgetTheme = useWidgetTheme();

  const theme = useMemo(
    () => createTheme(widgetTheme.config.theme),
    [widgetTheme.config.theme],
  );

  return (
    <ThemeProvider
      theme={theme}
      modeStorageKey={THEME_MODE_STORAGE_KEY}
      colorSchemeStorageKey={THEME_COLOR_SCHEME_STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
