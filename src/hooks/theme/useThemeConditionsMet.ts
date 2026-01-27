import { useMemo } from 'react';
import { isBefore } from 'date-fns';
import { useThemeStore } from 'src/stores/theme';

export const useThemeConditionsMet = () => {
  const [configTheme, configThemeStates] = useThemeStore((state) => [
    state.configTheme,
    state.configThemeStates,
  ]);

  const activeConfigThemeState = useMemo(() => {
    const entry = Object.entries(configThemeStates).find(
      ([uid]) => uid === configTheme?.uid,
    );
    return entry?.[1];
  }, [configThemeStates, configTheme]);

  const shouldShowForTheme = useMemo(() => {
    if (!activeConfigThemeState?.isSelected) {
      return false;
    }

    if (!activeConfigThemeState.expirationDate) {
      return false;
    }

    return isBefore(new Date(), activeConfigThemeState.expirationDate);
  }, [activeConfigThemeState]);

  return {
    shouldShowForTheme,
  };
};
