import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { ThemeModesSupported } from '@transferto/shared/src/types/settings';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useSettingsStore } from '../../stores';
import { EventTrackingTool } from '../../types';
import { TrackingActions, TrackingCategories } from '../trackingKeys';

export const useThemeContent = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const [themeMode, onChangeMode] = useSettingsStore((state) => [
    state.themeMode,
    state.onChangeMode,
  ]);

  const handleSwitchMode = (mode: ThemeModesSupported) => {
    onChangeMode(mode);
    trackEvent({
      category: TrackingCategories.ThemeMenu,
      action: TrackingActions.SwitchThemeMode,
      label: `theme-${mode}`,
      data: { theme: `theme-${mode}` },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
  };

  return [
    {
      label: t('navbar.themes.light'),
      prefixIcon:
        themeMode === 'light' ? <LightModeIcon /> : <LightModeOutlinedIcon />,
      checkIcon: themeMode === 'light',
      onClick: () => handleSwitchMode('light'),
    },
    {
      label: t('navbar.themes.dark'),
      prefixIcon:
        themeMode === 'dark' ? <NightlightIcon /> : <NightlightOutlinedIcon />,
      checkIcon: themeMode === 'dark',
      onClick: () => handleSwitchMode('dark'),
    },
    {
      label: t('navbar.themes.auto'),
      prefixIcon:
        themeMode === 'auto' ? (
          <BrightnessAutoIcon />
        ) : (
          <BrightnessAutoOutlinedIcon />
        ),
      checkIcon: themeMode === 'auto',
      onClick: () => handleSwitchMode('auto'),
    },
  ];
};
