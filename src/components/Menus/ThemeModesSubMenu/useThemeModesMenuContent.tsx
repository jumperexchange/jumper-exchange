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

  const activeConfigThemeUid = useMemo(() => {
    const entry = Object.entries(configThemeStates).find(
      ([_, state]) => state.isSelected,
    );
    return entry?.[0];
  }, [configThemeStates]);

  const displayablePartnerThemes = useMemo(() => {
    return availablePartnerThemes.filter(
      (theme) => theme.SelectableInMenu && theme.PartnerName,
    );
  }, [availablePartnerThemes]);

  const activeConfigTheme = useMemo(() => {
    return displayablePartnerThemes.find(
      (theme) => theme.uid === activeConfigThemeUid,
    );
  }, [displayablePartnerThemes, activeConfigThemeUid]);

  useEffect(() => {
    if (!activeConfigTheme) {
      return;
    }
    const themeMode = isDarkOrLightThemeMode(activeConfigTheme);

    if (themeMode !== mode) {
      setMode(themeMode);
    }
  }, [activeConfigTheme, mode, setMode]);

  // Reset mode when the selected partner theme no longer exists (removed from CMS)
  useEffect(() => {
    if (activeConfigThemeUid && !activeConfigTheme) {
      setMode('system');
      setConfigThemeState(activeConfigThemeUid, { isSelected: false });
    }
  }, [activeConfigThemeUid, activeConfigTheme, setMode, setConfigThemeState]);

  const handleSwitchMode = useCallback(
    (newMode: Appearance) => {
      trackEvent({
        category: TrackingCategory.ThemeSection,
        action: TrackingAction.SwitchTheme,
        label: `theme_${newMode}`,
        data: {
          [TrackingEventParameter.SwitchedTheme]: newMode,
        },
      });

      setMode(newMode ?? 'system');

      if (activeConfigThemeUid) {
        setConfigThemeState(activeConfigThemeUid, { isSelected: false });
      }
    },
    [trackEvent, setMode, activeConfigThemeUid, setConfigThemeState],
  );

  const handleSwitchTheme = useCallback(
    (theme: PartnerThemesData) => {
      trackEvent({
        category: TrackingCategory.ThemeSection,
        action: TrackingAction.SwitchThemeTemplate,
        label: `theme_${theme.uid}`,
        data: {
          [TrackingEventParameter.SwitchedTemplate]: theme.uid,
        },
      });

      if (activeConfigThemeUid && activeConfigThemeUid !== theme.uid) {
        setConfigThemeState(activeConfigThemeUid, { isSelected: false });
      }

      setConfigThemeState(theme.uid, { isSelected: true });

      const themeMode = isDarkOrLightThemeMode(theme);
      setMode(themeMode);
    },
    [trackEvent, setConfigThemeState, setMode, activeConfigThemeUid],
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

  // Note: using partnerThemeItems as we might change the label or prefix icon
  const selectedPartnerTheme = useMemo(() => {
    return partnerThemeItems.find((theme) => theme.checkIcon);
  }, [partnerThemeItems]);

  const submenuItems = useMemo(
    () => [...standardModeItems, ...partnerThemeItems],
    [standardModeItems, partnerThemeItems],
  );

  return {
    selectedThemeMode: selectedThemeMode,
    selectedPartnerTheme: selectedPartnerTheme?.label,
    selectedThemeIcon:
      selectedPartnerTheme?.prefixIcon ?? MODE_OPTIONS[selectedThemeMode].icon,
    submenuItems,
  };
};
