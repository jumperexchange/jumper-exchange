'use client';

import { useEffect } from 'react';
import { useActiveMenuPartnerTheme } from '@/hooks/theme/useActiveMenuPartnerTheme';
import { clearPartnerColorModeOverride } from '@/providers/ThemeProvider/partnerThemeMode';
import { useThemeStore } from '@/stores/theme';

/**
 * Clears menu partner selection when the partner-theme AB test is off.
 * Color mode is applied synchronously via applySelectedPartnerColorMode (no setMode here).
 */
export const MUIThemePartnerSync = () => {
  const setConfigThemeState = useThemeStore(
    (state) => state.setConfigThemeState,
  );
  const configThemeStates = useThemeStore((state) => state.configThemeStates);
  const { isThemePartnerDefaultEnabled, isThemePartnerDefaultLoading } =
    useActiveMenuPartnerTheme();

  useEffect(() => {
    if (isThemePartnerDefaultLoading || isThemePartnerDefaultEnabled) {
      return;
    }

    for (const [uid, state] of Object.entries(configThemeStates)) {
      if (state.isSelected) {
        setConfigThemeState(uid, { isSelected: false });
      }
    }

    clearPartnerColorModeOverride();
  }, [
    isThemePartnerDefaultLoading,
    isThemePartnerDefaultEnabled,
    configThemeStates,
    setConfigThemeState,
  ]);

  return null;
};
