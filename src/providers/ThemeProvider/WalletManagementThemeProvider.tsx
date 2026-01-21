'use client';
import { ThemeProvider } from '@mui/material';
import { useMemo } from 'react';
import { createTheme } from '@lifi/widget';
import { useGetPartnerWidgetTheme } from '@/hooks/theme/useGetPartnerWidgetTheme';
import { deepmerge } from '@mui/utils';

export const WalletManagementThemeProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const widgetTheme = useGetPartnerWidgetTheme();

  const theme = useMemo(() => {
    const _theme = createTheme(widgetTheme.config.theme);
    _theme.components = deepmerge(
      _theme.components,
      widgetTheme.config.theme?.components ?? {},
    );
    return _theme;
  }, [widgetTheme.config.theme]);

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
