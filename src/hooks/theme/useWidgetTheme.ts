import { useMemo } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { useThemeStore } from 'src/stores/theme';
import { useThemeConditionsMet } from './useThemeConditionsMet';
import type { WidgetThemeConfig } from 'src/types/theme';
import useMediaQuery from '@mui/material/useMediaQuery';

/**
 * Returns the appropriate pre-computed widget theme based on:
 * - Current color mode (light/dark)
 * - Partner theme conditions (active, expiration)
 *
 * This hook is a pure selector - no computation needed at runtime.
 */
export const useWidgetTheme = (): WidgetThemeConfig => {
  const widgetTheme = useThemeStore((state) => state.widgetTheme);
  const { mode } = useColorScheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { shouldShowForTheme } = useThemeConditionsMet();

  return useMemo(() => {
    const currentMode =
      mode === 'system'
        ? prefersDarkMode
          ? 'dark'
          : 'light'
        : (mode ?? 'light');
    const usePartner = shouldShowForTheme;

    if (usePartner) {
      return currentMode === 'dark'
        ? widgetTheme.partnerDark
        : widgetTheme.partnerLight;
    }

    return currentMode === 'dark' ? widgetTheme.dark : widgetTheme.light;
  }, [mode, prefersDarkMode, shouldShowForTheme, widgetTheme]);
};
