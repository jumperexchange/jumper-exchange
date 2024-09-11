import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useSettingsStore } from '@/stores/settings';
import type { ThemeModesSupported } from '@/types/settings';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useTheme } from 'next-themes';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { useSuperfest } from 'src/hooks/useSuperfest';

export const useThemeSwitchTabs = () => {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const { trackEvent } = useUserTracking();
  const [, setCookie] = useCookies(['themeMode']);
  const { isSuperfest } = useSuperfest();
  const { isMainPaths } = useMainPaths();
  const [themeMode, setThemeMode] = useSettingsStore((state) => [
    state.themeMode,
    state.setThemeMode,
  ]);
  const configTheme = useSettingsStore((state) => state.configTheme);
  const handleSwitchMode = (mode: ThemeModesSupported) => {
    trackEvent({
      category: TrackingCategory.ThemeSection,
      action: TrackingAction.SwitchTheme,
      label: `theme_${mode}`,
      data: {
        [TrackingEventParameter.SwitchedTheme]: mode,
      },
    });
    setCookie('themeMode', mode, {
      path: '/',
      sameSite: true,
    });
    setThemeMode(mode);
    setTheme(mode);
  };

  // tooltips:
  const lightModeTooltip = !configTheme?.availableThemeModes.includes('dark')
    ? t('navbar.themes.lightModeDisabled')
    : t('navbar.themes.switchToLight');
  const darkModeTooltip = !configTheme?.availableThemeModes.includes('light')
    ? t('navbar.themes.darkModeDisabled')
    : t('navbar.themes.switchToDark');
  const systemModeTooltip =
    !lightModeTooltip && !darkModeTooltip
      ? t('navbar.themes.systemModeDisabled')
      : t('navbar.themes.switchToSystem');

  // handlers:
  let lightModeEnabled = false;
  let darkModeEnabled = false;
  let systemModeEnabled = false;

  if (isSuperfest || isMainPaths) {
    lightModeEnabled = true;
  } else if (!!configTheme) {
    if (
      configTheme.availableThemeModes.includes('light') &&
      configTheme.availableThemeModes.includes('dark')
    ) {
      systemModeEnabled = true;
      lightModeEnabled = true;
      darkModeEnabled = true;
    } else {
      if (configTheme.availableThemeModes.includes('light')) {
        lightModeEnabled = true;
      }
      if (configTheme.availableThemeModes.includes('dark')) {
        darkModeEnabled = true;
      }
    }
  } else {
    systemModeEnabled = true;
    lightModeEnabled = true;
    darkModeEnabled = true;
  }

  lightModeEnabled = true;
  darkModeEnabled = true;
  systemModeEnabled = true;

  const output = [
    {
      tooltip: themeMode !== 'light' ? lightModeTooltip : undefined,
      value: 0,
      blur: !lightModeEnabled,
      icon: (
        <LightModeIcon
          sx={{
            fill: 'currentColor',
          }}
        />
      ),
      onClick: () => {
        handleSwitchMode('light');
      },
    },
    {
      tooltip: themeMode !== 'dark' ? darkModeTooltip : undefined,
      value: 1,
      blur: !darkModeEnabled,
      icon: (
        <NightlightIcon
          sx={{
            fill: 'currentColor',
          }}
        />
      ),
      onClick: () => {
        handleSwitchMode('dark');
      },
    },
    {
      tooltip: themeMode !== 'system' ? systemModeTooltip : undefined,
      value: 2,
      blur: !systemModeEnabled,
      icon: (
        <BrightnessAutoIcon
          sx={{
            fill: 'currentColor',
          }}
        />
      ),
      onClick: () => {
        handleSwitchMode('system');
      },
    },
  ];

  return output;
};
