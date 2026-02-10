import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import FlareRoundedIcon from '@mui/icons-material/FlareRounded';
import { useMemo, useCallback, useEffect } from 'react';
import type { Appearance } from '@lifi/widget';
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
import Avatar from '@mui/material/Avatar';
import { selectAvailablePartnerThemes } from '@/stores/theme/createThemeStore';

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

  const [setConfigThemeState, configThemeStates] = useThemeStore((state) => [
    state.setConfigThemeState,
    state.configThemeStates,
  ]);
  const availablePartnerThemes = useThemeStore(selectAvailablePartnerThemes);

  const defaultMode = isMainPaths ? 'system' : 'light';
  const selectedThemeMode = mode ?? defaultMode;

  const { activeConfigThemeUid, activeConfigTheme } = useMemo(() => {
    for (const [uid, state] of Object.entries(configThemeStates)) {
      if (state.isSelected) {
        const theme = availablePartnerThemes.find((t) => t.uid === uid);
        return { activeConfigThemeUid: uid, activeConfigTheme: theme };
      }
    }
    return { activeConfigThemeUid: undefined, activeConfigTheme: undefined };
  }, [configThemeStates, availablePartnerThemes]);

  useEffect(() => {
    if (!activeConfigTheme) {
      if (activeConfigThemeUid) {
        setMode('system');
        console.debug('Changed theme mode to: system');
        setConfigThemeState(activeConfigThemeUid, { isSelected: false });
      }
      return;
    }

    const themeMode = isDarkOrLightThemeMode(activeConfigTheme);
    if (themeMode !== mode) {
      setMode(themeMode);
      console.debug(`Changed theme mode to: ${themeMode}`);
    }
  }, [
    activeConfigThemeUid,
    activeConfigTheme,
    mode,
    setMode,
    setConfigThemeState,
  ]);

  const clearPartnerTheme = useCallback(() => {
    if (activeConfigThemeUid) {
      setConfigThemeState(activeConfigThemeUid, { isSelected: false });
    }
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
      const newModeWithFallback = newMode ?? 'system';
      setMode(newModeWithFallback);
      console.debug(`Changing theme mode to: ${newModeWithFallback}`);
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
      const newMode = isDarkOrLightThemeMode(theme);
      setMode(newMode);
      console.debug(`Changing theme mode to: ${newMode}`);
    },
    [trackEvent, setConfigThemeState, setMode, clearPartnerTheme],
  );

  const displayablePartnerThemes = useMemo(
    () =>
      availablePartnerThemes.filter((t) => t.SelectableInMenu && t.PartnerName),
    [availablePartnerThemes],
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
            <Avatar
              src={themeModeIcon}
              alt={theme.PartnerName}
              sx={{
                height: 24,
                width: 24,
                filter: 'grayscale(100%) contrast(2)',
              }}
            />
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
    () => partnerThemeItems.find((t) => t.checkIcon),
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
