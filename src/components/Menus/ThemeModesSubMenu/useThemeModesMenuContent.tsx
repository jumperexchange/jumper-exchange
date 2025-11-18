import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useThemeStore } from '@/stores/theme';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import type { Appearance } from '@lifi/widget';
import { useThemeConditionsMet } from 'src/hooks/theme/useThemeConditionsMet';
import { useEffect, useRef } from 'react';

export const useThemeModesMenuContent = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { isMainPaths } = useMainPaths();
  const [configTheme] = useThemeStore((state) => [state.configTheme]);
  const defaultThemeMode = configTheme?.defaultThemeMode;
  const isThemeConditionsMet = useThemeConditionsMet();
  const defaultMode = isMainPaths ? 'system' : 'light';
  const selectedThemeMode = mode ?? defaultMode;
  const selectedThemeModeRef = useRef<Appearance | undefined>(undefined);

  useEffect(() => {
    if (
      isThemeConditionsMet &&
      defaultThemeMode &&
      selectedThemeMode !== defaultThemeMode
    ) {
      setMode(defaultThemeMode);
      selectedThemeModeRef.current = selectedThemeMode;
    } else if (
      !isThemeConditionsMet &&
      selectedThemeModeRef.current &&
      selectedThemeModeRef.current !== selectedThemeMode
    ) {
      setMode(selectedThemeModeRef.current);
      selectedThemeModeRef.current = undefined;
    }
  }, [isThemeConditionsMet, defaultThemeMode, selectedThemeMode, setMode]);

  const handleSwitchMode = (newMode: Appearance) => {
    trackEvent({
      category: TrackingCategory.ThemeSection,
      action: TrackingAction.SwitchTheme,
      label: `theme_${newMode}`,
      data: {
        [TrackingEventParameter.SwitchedTheme]: newMode,
      },
    });
    setMode(newMode ?? 'system');
  };

  const isModeAvailable = (theme: Appearance) =>
    isMainPaths ||
    !configTheme?.availableThemeModes ||
    configTheme.availableThemeModes.includes(theme);

  const modeOptions = {
    light: {
      label: t('navbar.themes.light'),
      prefixIcon: <WbSunnyOutlinedIcon />,
    },
    dark: {
      label: t('navbar.themes.dark'),
      prefixIcon: <NightlightIcon />,
    },
    system: {
      label: t('navbar.themes.system'),
      prefixIcon: <BrightnessAutoIcon />,
    },
  } as const;

  const submenuItems = (['light', 'dark', 'system'] as Appearance[]).map(
    (theme) => ({
      label: modeOptions[theme].label,
      prefixIcon: modeOptions[theme].prefixIcon,
      checkIcon: mode === theme,
      onClick: () => handleSwitchMode(theme),
      disabled: isThemeConditionsMet || !isModeAvailable(theme),
    }),
  );

  return {
    selectedThemeMode,
    selectedThemeIcon: modeOptions[selectedThemeMode].prefixIcon,
    submenuItems,
  };
};
