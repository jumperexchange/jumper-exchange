import type { PartnerThemesData } from '../src/types/strapi';
import { isDarkOrLightThemeMode } from '../src/utils/formatTheme';
import { useColorScheme } from '@mui/material/styles';
import { useLayoutEffect } from 'react';
import {
  applySelectedPartnerColorMode,
  clearPartnerColorModeOverride,
} from '../src/providers/ThemeProvider/partnerThemeMode';
import { useThemeStore } from '../src/stores/theme';
import { isNoPartnerThemeUid } from './partnerThemeConstants.ts';

interface PartnerThemeBridgeProps {
  partnerThemeUid: string;
  standardColorMode: 'light' | 'dark';
  partnerThemes: PartnerThemesData[];
}

/** Mirrors ThemeModesSubMenu partner selection + light/dark mode behaviour. */
export const PartnerThemeBridge = ({
  partnerThemeUid,
  standardColorMode,
  partnerThemes,
}: PartnerThemeBridgeProps) => {
  const { setMode } = useColorScheme();
  const setConfigThemeState = useThemeStore(
    (state) => state.setConfigThemeState,
  );

  useLayoutEffect(() => {
    if (isNoPartnerThemeUid(partnerThemeUid)) {
      partnerThemes.forEach((theme) => {
        setConfigThemeState(theme.uid, { isSelected: false });
      });
      clearPartnerColorModeOverride();
      setMode(standardColorMode);
      return;
    }

    const selectedTheme = partnerThemes.find(
      (theme) => theme.uid === partnerThemeUid,
    );

    if (!selectedTheme) {
      return;
    }

    partnerThemes.forEach((theme) => {
      setConfigThemeState(theme.uid, {
        isSelected: theme.uid === partnerThemeUid,
      });
    });

    applySelectedPartnerColorMode(
      { [partnerThemeUid]: { isSelected: true } },
      partnerThemes,
    );
    setMode(isDarkOrLightThemeMode(selectedTheme));
  }, [
    partnerThemeUid,
    partnerThemes,
    setConfigThemeState,
    setMode,
    standardColorMode,
  ]);

  return null;
};
