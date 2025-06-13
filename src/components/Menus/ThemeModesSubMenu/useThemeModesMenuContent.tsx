import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import LightModeIcon from '@mui/icons-material/LightMode';
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
import { Appearance } from '@lifi/widget';

export const useThemeModesMenuContent = () => {
  const { mode, setMode } = useColorScheme();
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const { isMainPaths } = useMainPaths();
  const [configTheme] = useThemeStore((state) => [state.configTheme]);

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
      prefixIcon: <LightModeIcon />,
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
      disabled: !isModeAvailable(theme),
    }),
  );

  const defaultMode = isMainPaths ? 'system' : 'light';

  return {
    selectedThemeMode: mode ?? defaultMode,
    selectedThemeIcon: modeOptions[mode ?? defaultMode].prefixIcon,
    submenuItems,
  };
};
