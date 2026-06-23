'use client';

import { useMemo } from 'react';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { resolveSelectedMenuPartnerTheme } from '@/providers/ThemeProvider/partnerThemeMode';
import { useThemeStore } from '@/stores/theme';
import { selectAvailablePartnerThemes } from '@/stores/theme/createThemeStore';

export const useActiveMenuPartnerTheme = () => {
  const configThemeStates = useThemeStore((state) => state.configThemeStates);
  const availablePartnerThemes = useThemeStore(selectAvailablePartnerThemes);
  const partnerThemes = useThemeStore((state) => state.partnerThemes);
  const {
    isEnabled: isThemePartnerDefaultEnabled,
    isLoading: isThemePartnerDefaultLoading,
  } = useABTest({
    feature: AB_TEST_NAME.THEME_PARTNER_DEFAULT,
  });

  const showPartnerThemes =
    isThemePartnerDefaultEnabled || isThemePartnerDefaultLoading;

  const activeConfigTheme = useMemo(() => {
    if (!showPartnerThemes) {
      return undefined;
    }

    return resolveSelectedMenuPartnerTheme(configThemeStates, partnerThemes);
  }, [configThemeStates, partnerThemes, showPartnerThemes]);

  const activeConfigThemeUid = activeConfigTheme?.uid;

  const displayablePartnerThemes = useMemo(
    () =>
      showPartnerThemes
        ? availablePartnerThemes.filter(
            (t) => t.SelectableInMenu && t.PartnerName,
          )
        : [],
    [availablePartnerThemes, showPartnerThemes],
  );

  return {
    activeConfigThemeUid,
    activeConfigTheme,
    displayablePartnerThemes,
    isThemePartnerDefaultEnabled,
    isThemePartnerDefaultLoading,
    showPartnerThemes,
  };
};
