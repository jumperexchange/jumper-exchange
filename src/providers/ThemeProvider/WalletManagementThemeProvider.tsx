'use client';
import { ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import { createTheme } from '@lifi/widget';
import { useThemeStore } from '@/stores/theme';

export const WalletManagementThemeProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const widgetTheme = useThemeStore((state) => state.widgetTheme);

  const theme = useMemo(
    () => createTheme(widgetTheme.config.theme),
    [widgetTheme.config.theme],
  );

  return (
    <ThemeProvider
      theme={theme}
      defaultMode={widgetTheme.config.appearance ?? 'system'}
      modeStorageKey="jumper-wallet-management-mode"
      colorSchemeStorageKey="jumper-wallet-management-color-scheme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
};
