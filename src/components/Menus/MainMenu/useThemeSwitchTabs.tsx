import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useSettingsStore } from '@/stores/settings';
import type { ThemeModesSupported } from '@/types/settings';
import { EventTrackingTool } from '@/types/userTracking';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { useMainPaths } from 'src/hooks/useMainPaths';
import { useSuperfest } from 'src/hooks/useSuperfest';
import { useTheme } from 'next-themes';

export const useThemeSwitchTabs = () => {
  const { t } = useTranslation();
  const { setTheme } = useTheme();
  const { trackEvent } = useUserTracking();
  const [, setCookie] = useCookies(['themeMode']);
  const { isSuperfest } = useSuperfest();
  const { isMainPaths } = useMainPaths();
  const browserTheme = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light';
  // const { availableWidgetThemeMode, hasTheme } = usePartnerTheme();
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
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    setCookie('themeMode', mode === 'auto' ? browserTheme : mode, {
      path: '/',
    });
    setThemeMode(mode);
    console.log(`change theme to mode ${mode}`);
    setTheme(mode);
  };

  // tooltips:
  const lightModeTooltip =
    configTheme?.availableThemeMode === 'dark'
      ? t('navbar.themes.lightModeDisabled')
      : t('navbar.themes.switchToLight');
  const darkModeTooltip =
    configTheme?.availableThemeMode === 'light'
      ? t('navbar.themes.darkModeDisabled')
      : t('navbar.themes.switchToDark');
  const systemModeTooltip =
    configTheme?.availableThemeMode !== 'system'
      ? t('navbar.themes.systemModeDisabled')
      : t('navbar.themes.switchToSystem');

  // handlers:
  let lightModeEnabled = false;
  let darkModeEnabled = false;
  let systemModeEnabled = false;

  if (isSuperfest || isMainPaths) {
    lightModeEnabled = true;
  } else if (!!configTheme) {
    if (configTheme.availableThemeMode === 'system') {
      systemModeEnabled = true;
      lightModeEnabled = true;
      darkModeEnabled = true;
    } else {
      if (configTheme.availableThemeMode === 'light') {
        lightModeEnabled = true;
      }
      if (configTheme.availableThemeMode === 'dark') {
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
        lightModeEnabled && themeMode !== 'light' && handleSwitchMode('light');
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
        darkModeEnabled && themeMode !== 'dark' && handleSwitchMode('dark');
      },
    },
    {
      tooltip: themeMode !== 'auto' ? systemModeTooltip : undefined,
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
        systemModeEnabled && themeMode !== 'auto' && handleSwitchMode('auto');
      },
    },
  ];

  return output;
};
