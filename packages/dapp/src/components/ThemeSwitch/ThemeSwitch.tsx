import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';
import {
  TrackingActions,
  TrackingCategories,
} from '../../../../dapp/src/const';
import {
  EventTrackingTools,
  useUserTracking,
} from '../../../../dapp/src/hooks';
import { useDetectDarkModePreference } from '../../providers/ThemeProvider';
import { useSettingsStore } from '../../stores';
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
      category: TrackingCategories.THEME_SWITCH,
      action: TrackingActions.CLICK_THEME_SWITCH,
      label: `themeSwitch-${isDarkMode ? 'light' : 'dark'}`,
      data: { themeSwitch: `theme-${isDarkMode ? 'light' : 'dark'}` },
      disableTrackingTool: [EventTrackingTools.arcx],
    });
  };

  return (
    <Tooltip
      title={
        themeMode === 'light'
          ? translate(`${i18Path}themes.light`)
          : themeMode === 'dark'
          ? translate(`${i18Path}themes.dark`)
          : translate(`${i18Path}themes.auto`)
      }
    >
      <ButtonThemeSwitch
        onClick={() => {
          handleThemeSwitch();
        }}
      >
        {themeMode === 'light' ? (
          <LightModeIcon />
        ) : themeMode === 'dark' ? (
          <NightlightIcon />
        ) : (
          <BrightnessAutoIcon />
        )}
      </ButtonThemeSwitch>
    </Tooltip>
  );
};
