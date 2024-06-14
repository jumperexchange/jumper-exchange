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
import { useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { usePartnerTheme } from 'src/hooks/usePartnerTheme';

export const useThemeSwitchTabs = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const [, setCookie] = useCookies(['theme']);
  const browserTheme = useMediaQuery('(prefers-color-scheme: dark)')
    ? 'dark'
    : 'light';
  const { partnerTheme, activeUid } = usePartnerTheme();

  const darkThemeSwitchEnabled = useMemo(() => {
    if (activeUid) {
      if (partnerTheme?.attributes.darkModeEnabled) {
        return true;
      } else {
        return false;
      }
    } else {
      return undefined;
    }
  }, [activeUid, partnerTheme?.attributes.darkModeEnabled]);
  const setThemeMode = useSettingsStore((state) => state.setThemeMode);
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
    setCookie('theme', mode === 'auto' ? browserTheme : mode, { path: '/' });
    setThemeMode(mode);
  };

  const output = [
    {
      tooltip: t('navbar.themes.switchToLight'),
      value: 0,
      blur: darkThemeSwitchEnabled,
      icon: (
        <LightModeIcon
          sx={{
            fill: 'currentColor',
          }}
        />
      ),
      onClick: () => {
        (darkThemeSwitchEnabled === undefined ||
          darkThemeSwitchEnabled === false) &&
          handleSwitchMode('light');
      },
    },
    {
      tooltip: t('navbar.themes.switchToDark'),
      value: 1,
      blur:
        darkThemeSwitchEnabled !== undefined &&
        darkThemeSwitchEnabled === false,
      icon: (
        <NightlightIcon
          sx={{
            fill: 'currentColor',
          }}
        />
      ),
      onClick: () => {
        (darkThemeSwitchEnabled === undefined ||
          darkThemeSwitchEnabled === true) &&
          handleSwitchMode('dark');
      },
    },
    {
      tooltip: t('navbar.themes.switchToSystem'),
      value: 2,
      blur: darkThemeSwitchEnabled !== undefined,
      icon: (
        <BrightnessAutoIcon
          sx={{
            fill: 'currentColor',
          }}
        />
      ),
      onClick: () => {
        darkThemeSwitchEnabled === undefined && handleSwitchMode('auto');
      },
    },
  ];

  return output;
};
