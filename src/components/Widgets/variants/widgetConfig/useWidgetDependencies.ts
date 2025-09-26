import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useWalletMenu } from '@lifi/wallet-management';
import { useThemeStore } from 'src/stores/theme/ThemeStore';
import { HookDependencies } from './types';

/**
 * Hook that provides all the React hook dependencies needed for widget configuration.
 * This centralizes hook usage and makes testing easier by allowing dependency injection.
 */
export function useWidgetDependencies(): HookDependencies {
  const { i18n, t } = useTranslation();
  const muiTheme = useTheme();
  const [widgetTheme, configTheme] = useThemeStore((state) => [
    state.widgetTheme,
    state.configTheme,
  ]);
  const { openWalletMenu } = useWalletMenu();

  return useMemo(
    () => ({
      translation: { i18n, t },
      theme: { muiTheme, widgetTheme, configTheme },
      wallet: { openWalletMenu },
    }),
    [i18n, t, muiTheme, widgetTheme, configTheme, openWalletMenu],
  );
}
