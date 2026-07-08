'use client';
import { useMemo } from 'react';
import { AB_TEST_NAME } from 'src/const/abtests';
import { useABTest } from 'src/hooks/useABTest';
import { useThemeStore } from 'src/stores/theme';

export const useThemeConditionsMet = () => {
  const [configTheme, configThemeStates] = useThemeStore((state) => [
    state.configTheme,
    state.configThemeStates,
  ]);

  const { isEnabled: isThemePartnerDefaultEnabled } = useABTest({
    feature: AB_TEST_NAME.THEME_PARTNER_DEFAULT,
  });

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

    return isThemePartnerDefaultEnabled;
  }, [activeConfigThemeState, isThemePartnerDefaultEnabled]);

  return {
    shouldShowForTheme,
    shouldShowFeatureCardBackground:
      configTheme?.allowFeatureCardBackground ?? true,
  };
};
