import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useTheme } from '@mui/material';
import { ThemeModesSupported } from '@transferto/shared/types';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../hooks';
import { useSettingsStore } from '../stores';
import { EventTrackingTool } from '../types';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from './trackingKeys';

export const useThemeSwitchTabs = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();

  const [themeMode, onChangeMode] = useSettingsStore((state) => [
    state.themeMode,
    state.onChangeMode,
  ]);

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
    onChangeMode(mode);
  };

  const output = [
    {
      tooltip: t('navbar.themes.switchToLight'),
      value: 0,
      icon: (
        <LightModeIcon
          sx={{
            fill:
              themeMode === 'light' ? 'currentColor' : theme.palette.grey[700],
          }}
        />
      ),
      onClick: () => {
        handleSwitchMode('light');
      },
    },
    {
      tooltip: t('navbar.themes.switchToDark'),
      value: 1,
      icon: (
        <NightlightIcon
          sx={{
            fill:
              themeMode === 'dark' ? 'currentColor' : theme.palette.grey[700],
          }}
        />
      ),
      onClick: () => {
        handleSwitchMode('dark');
      },
    },
    {
      tooltip: t('navbar.themes.switchToSystem'),
      value: 2,
      icon: (
        <BrightnessAutoIcon
          sx={{
            fill:
              themeMode === 'auto' ? 'currentColor' : theme.palette.grey[700],
          }}
        />
      ),
      onClick: () => {
        handleSwitchMode('auto');
      },
    },
  ];

  return output;
};
