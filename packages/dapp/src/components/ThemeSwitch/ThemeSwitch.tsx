import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import {
  TrackingActions,
  TrackingCategories,
} from '@transferto/dapp/src/const';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import { useUserTracking } from '../../hooks';
import { useDetectDarkModePreference } from '../../providers/ThemeProvider';
import { useSettingsStore } from '../../stores';
import { EventTrackingTools } from '../../types';
import { ButtonThemeSwitch } from './ThemeSwitch.style';

export const ThemeSwitch = () => {
  const isDarkMode = useDetectDarkModePreference();

  const [themeMode, onChangeMode] = useSettingsStore(
    (state) => [state.themeMode, state.onChangeMode],
    shallow,
  );

  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const { trackEvent } = useUserTracking();

  const handleThemeSwitch = () => {
    onChangeMode(isDarkMode ? 'light' : 'dark');
    trackEvent({
      category: TrackingCategories.ThemeSwitch,
      action: TrackingActions.ClickThemeSwitch,
      label: `themeSwitch-${isDarkMode ? 'light' : 'dark'}`,
      data: { themeSwitch: `theme-${isDarkMode ? 'light' : 'dark'}` },
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <Tooltip
      title={
        themeMode === 'light'
          ? translate(`${i18Path}themes.switchToDark`)
          : themeMode === 'dark'
          ? translate(`${i18Path}themes.switchToLight`)
          : !isDarkModeHook
          ? translate(`${i18Path}themes.switchToDark`)
          : translate(`${i18Path}themes.switchToLight`)
      }
    >
      <ButtonThemeSwitch
        onClick={() => {
          handleThemeSwitch();
        }}
      >
        {themeMode === 'light' ? (
          <NightlightIcon />
        ) : themeMode === 'dark' ? (
          <LightModeIcon />
        ) : (
          <BrightnessAutoIcon />
        )}
      </ButtonThemeSwitch>
    </Tooltip>
  );
};
