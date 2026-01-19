import { useMemo } from 'react';
import { useColorScheme } from '@mui/material/styles';
import { useThemeStore } from 'src/stores/theme';
import { getDefaultWidgetThemeV2 } from 'src/config/widgetConfig';
import { useThemeConditionsMet } from './useThemeConditionsMet';

export const useGetPartnerWidgetTheme = () => {
  const widgetTheme = useThemeStore((state) => state.widgetTheme);
  const { mode } = useColorScheme();
  const { shouldShowForTheme, shouldShowForPath } = useThemeConditionsMet();

  return useMemo(() => {
    if (shouldShowForTheme && shouldShowForPath) {
      return widgetTheme;
    }
    const currentMode = mode === 'system' || !mode ? 'light' : mode;
    return getDefaultWidgetThemeV2(currentMode);
  }, [shouldShowForTheme, shouldShowForPath, widgetTheme, mode]);
};
