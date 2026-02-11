'use client';
import { ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import { createTheme } from '@lifi/widget';
import { useWidgetTheme } from '@/hooks/theme/useWidgetTheme';
import { deepmerge } from '@mui/utils';
import {
  THEME_COLOR_SCHEME_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
} from './constants';

export const WalletManagementThemeProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const widgetTheme = useWidgetTheme();

  const theme = useMemo(() => {
    const _theme = createTheme(widgetTheme.config.theme);
    _theme.components = deepmerge(
      _theme.components ?? {},
      widgetTheme.config.theme?.components ?? {},
    );
    return _theme;
  }, [widgetTheme.config.theme]);

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
