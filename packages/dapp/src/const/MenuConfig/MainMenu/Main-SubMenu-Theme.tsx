import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { ThemeModesSupported } from '@transferto/shared/src/types/settings';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { EventTrackingTools } from '../../../hooks';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';
import { useSettingsStore } from '../../../stores';
import { TrackingActions, TrackingCategories } from '../../trackingKeys';

export const useMainSubMenuTheme = () => {
  const { t: translate } = useTranslation();
  const { trackEvent } = useUserTracking();
  const i18Path = 'navbar.';

  const [themeMode, onChangeMode] = useSettingsStore(
    (state) => [state.themeMode, state.onChangeMode],
    shallow,
  );

  const handleSwitchMode = (mode: ThemeModesSupported) => {
    onChangeMode(mode);
    trackEvent({
      category: TrackingCategories.ThemeMenu,
      action: TrackingActions.SwitchThemeMode,
      label: `theme-${mode}`,
      data: { theme: `theme-${mode}` },
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  return [
    {
      label: `${translate(`${i18Path}themes.light`)}`,
      prefixIcon:
        themeMode === 'light' ? <LightModeIcon /> : <LightModeOutlinedIcon />,
      checkIcon: themeMode === 'light',
      onClick: () => handleSwitchMode('light'),
    },
    {
      label: `${translate(`${i18Path}themes.dark`)}`,
      prefixIcon:
        themeMode === 'dark' ? <NightlightIcon /> : <NightlightOutlinedIcon />,
      checkIcon: themeMode === 'dark',
      onClick: () => handleSwitchMode('dark'),
    },
    {
      label: `${translate(`${i18Path}themes.auto`)}`,
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
