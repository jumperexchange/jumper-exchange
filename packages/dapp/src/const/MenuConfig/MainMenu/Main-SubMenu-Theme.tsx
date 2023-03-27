import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightIcon from '@mui/icons-material/Nightlight';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { useSettingsStore } from '@transferto/shared/src/contexts/SettingsContext';
import {
  SettingsContextProps,
  ThemeModesSupported,
} from '@transferto/shared/src/types/settings';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';

export const useMainSubMenuTheme = () => {
  const { t: translate } = useTranslation();
  const { trackEvent } = useUserTracking();
  const i18Path = 'navbar.';
  const themeMode = useSettingsStore(
    (state: SettingsContextProps) => state.themeMode,
  );
  const onChangeMode = useSettingsStore(
    (state: SettingsContextProps) => state.onChangeMode,
  );

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
