import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { ThemeModesSupported } from '@transferto/shared/src/types/settings';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../../hooks';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';

export const useMainSubMenuTheme = () => {
  const { t: translate } = useTranslation();
  const { trackEvent } = useUserTracking();
  const i18Path = 'navbar.';
  const { settings, onChangeMode } = useSettings();

  const handleSwitchMode = (mode: ThemeModesSupported) => {
    onChangeMode(mode);
    trackEvent({
      category: 'menu',
      action: `switch-theme-mode`,
      label: mode,
      data: { theme: `theme-${mode}` },
    });
  };

  return [
    {
      label: `${translate(`${i18Path}themes.light`)}`,
      prefixIcon:
        settings.themeMode === 'light' ? (
          <LightModeIcon />
        ) : (
          <LightModeOutlinedIcon />
        ),
      checkIcon: settings.themeMode === 'light',
      onClick: () => handleSwitchMode('light'),
    },
    {
      label: `${translate(`${i18Path}themes.dark`)}`,
      prefixIcon:
        settings.themeMode === 'dark' ? (
          <NightlightIcon />
        ) : (
          <NightlightOutlinedIcon />
        ),
      checkIcon: settings.themeMode === 'dark',
      onClick: () => handleSwitchMode('dark'),
    },
    {
      label: `${translate(`${i18Path}themes.auto`)}`,
      prefixIcon:
        settings.themeMode === 'auto' ? (
          <BrightnessAutoIcon />
        ) : (
          <BrightnessAutoOutlinedIcon />
        ),
      checkIcon: settings.themeMode === 'auto',
      onClick: () => handleSwitchMode('auto'),
    },
  ];
};
