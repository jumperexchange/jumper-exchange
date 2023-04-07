import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import {
  EventTrackingTools,
  useUserTracking,
} from '../../../../dapp/src/hooks';
import { useDetectDarkModePreference } from '../../../../dapp/src/providers/ThemeProvider';
import { useSettings } from '../../hooks';
import { ButtonThemeSwitch } from './ThemeSwitch.style';
export const ThemeSwitch = () => {
  const isDarkMode = useDetectDarkModePreference();
  const settings = useSettings();
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const { trackEvent } = useUserTracking();

  const handleThemeSwitch = () => {
    settings.onChangeMode(isDarkMode ? 'light' : 'dark');
    trackEvent({
      category: 'theme-switch',
      action: `click-theme-switch`,
      label: isDarkMode ? 'light' : 'dark',
      data: { themeSwitch: `theme-${isDarkMode ? 'light' : 'dark'}` },
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  const translation = {
    light: translate(`${i18Path}themes.light`),
    dark: translate(`${i18Path}themes.dark`),
    auto: translate(`${i18Path}themes.auto`),
    changeTheme: translate(`${i18Path}themes.changeTheme`),
  };

  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <Tooltip
      title={
        settings.themeMode === 'light'
          ? `${translation.changeTheme}: ${translation.dark}`
          : settings.themeMode === 'dark'
          ? `${translation.changeTheme}: ${translation.light}`
          : !isDarkModeHook
          ? `${translation.changeTheme}: ${translation.dark}`
          : `${translation.changeTheme}: ${translation.light}`
      }
    >
      <ButtonThemeSwitch
        onClick={() => {
          handleThemeSwitch();
        }}
      >
        {settings.themeMode === 'light' ? (
          <NightlightIcon />
        ) : settings.themeMode === 'dark' ? (
          <LightModeIcon />
        ) : (
          <BrightnessAutoIcon />
        )}
      </ButtonThemeSwitch>
    </Tooltip>
  );
};
