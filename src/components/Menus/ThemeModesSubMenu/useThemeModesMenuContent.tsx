import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import FlareRoundedIcon from '@mui/icons-material/FlareRounded';
import { useMemo, useCallback } from 'react';
import type { Appearance } from '@jumperexchange/widget';
import type { PartnerThemesData } from '@/types/strapi';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useThemeStore } from '@/stores/theme';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { isDarkOrLightThemeMode } from '@/utils/formatTheme';
import { useActiveMenuPartnerTheme } from '@/hooks/theme/useActiveMenuPartnerTheme';
import {
  applySelectedPartnerColorMode,
  clearPartnerColorModeOverride,
} from '@/providers/ThemeProvider/partnerThemeMode';
import { PartnerThemeIcon } from './PartnerThemeIcon';

interface SubmenuItem {
  label: string;
  prefixIcon: React.JSX.Element;
  checkIcon: boolean;
  onClick: () => void;
  disabled: boolean;
}

const MODE_OPTIONS = {
  light: {
    icon: <WbSunnyOutlinedIcon />,
    translationKey: 'navbar.themes.light',
  },
  dark: {
    icon: <NightlightIcon />,
    translationKey: 'navbar.themes.dark',
  },
  system: {
    icon: <BrightnessAutoIcon />,
    translationKey: 'navbar.themes.system',
  },
} as const;

const STANDARD_MODES: Appearance[] = ['light', 'dark', 'system'];

export const useThemeModesMenuContent = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { isMainPaths } = useMainPaths();

  const setConfigThemeState = useThemeStore(
    (state) => state.setConfigThemeState,
  );
  const partnerThemes = useThemeStore((state) => state.partnerThemes);
  const { activeConfigThemeUid, displayablePartnerThemes } =
    useActiveMenuPartnerTheme();

  const defaultMode = isMainPaths ? 'system' : 'light';
  const selectedThemeMode = mode ?? defaultMode;

  const clearPartnerTheme = useCallback(() => {
    if (activeConfigThemeUid) {
      setConfigThemeState(activeConfigThemeUid, { isSelected: false });
    }
    clearPartnerColorModeOverride();
  }, [activeConfigThemeUid, setConfigThemeState]);

  const handleSwitchMode = useCallback(
    (newMode: Appearance) => {
      trackEvent({
        category: TrackingCategory.ThemeSection,
        action: TrackingAction.SwitchTheme,
        label: `theme_${newMode}`,
        data: { [TrackingEventParameter.SwitchedTheme]: newMode },
      });
      clearPartnerTheme();
      clearPartnerColorModeOverride();
      setMode(newMode ?? 'system');
    },
    [trackEvent, setMode, clearPartnerTheme],
  );

  const handleSwitchTheme = useCallback(
    (theme: PartnerThemesData) => {
      trackEvent({
        category: TrackingCategory.ThemeSection,
        action: TrackingAction.SwitchThemeTemplate,
        label: `theme_${theme.uid}`,
        data: { [TrackingEventParameter.SwitchedTemplate]: theme.uid },
      });
      clearPartnerTheme();
      setConfigThemeState(theme.uid, { isSelected: true });
      const nextStates = {
        [theme.uid]: { isSelected: true as const },
      };
      applySelectedPartnerColorMode(nextStates, partnerThemes);
      setMode(isDarkOrLightThemeMode(theme));
    },
    [
      trackEvent,
      setConfigThemeState,
      setMode,
      clearPartnerTheme,
      partnerThemes,
    ],
  );

  const standardModeItems = useMemo<SubmenuItem[]>(
    () =>
      STANDARD_MODES.map((themeMode) => ({
        label: t(MODE_OPTIONS[themeMode].translationKey),
        prefixIcon: MODE_OPTIONS[themeMode].icon,
        checkIcon: !activeConfigThemeUid && mode === themeMode,
        onClick: () => handleSwitchMode(themeMode),
        disabled: false,
      })),
    [t, activeConfigThemeUid, mode, handleSwitchMode],
  );

  const partnerThemeItems = useMemo<SubmenuItem[]>(
    () =>
      displayablePartnerThemes.map((theme) => {
        const themeModeIcon = (theme.lightConfig || theme.darkConfig)
          ?.customization?.themeModeIcon;
        return {
          label: theme.PartnerName,
          prefixIcon: themeModeIcon ? (
            <PartnerThemeIcon src={themeModeIcon} alt={theme.PartnerName} />
          ) : (
            <FlareRoundedIcon />
          ),
          checkIcon: activeConfigThemeUid === theme.uid,
          onClick: () => handleSwitchTheme(theme),
          disabled: false,
        };
      }),
    [displayablePartnerThemes, activeConfigThemeUid, handleSwitchTheme],
  );

  const selectedPartnerThemeItem = useMemo(
    () => partnerThemeItems.find((item) => item.checkIcon),
    [partnerThemeItems],
  );

  return {
    selectedThemeMode,
    selectedPartnerTheme: selectedPartnerThemeItem?.label,
    selectedThemeIcon:
      selectedPartnerThemeItem?.prefixIcon ??
      MODE_OPTIONS[selectedThemeMode].icon,
    submenuItems: [...standardModeItems, ...partnerThemeItems],
  };
};
