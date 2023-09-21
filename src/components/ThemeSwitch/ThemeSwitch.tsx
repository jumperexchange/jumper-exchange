import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { TrackingActions, TrackingCategories } from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useDetectDarkModePreference } from 'src/providers';
import { useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { ButtonThemeSwitch } from '.';

export const ThemeSwitch = () => {
  const isDarkMode = useDetectDarkModePreference();

  const [themeMode, onChangeMode] = useSettingsStore((state) => [
    state.themeMode,
    state.onChangeMode,
  ]);

  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();

  const handleThemeSwitch = () => {
    onChangeMode(isDarkMode ? 'light' : 'dark');
    trackEvent({
      category: TrackingCategories.ThemeSwitch,
      action: TrackingActions.ClickThemeSwitch,
      label: `themeSwitch-${isDarkMode ? 'light' : 'dark'}`,
      data: { themeSwitch: `theme-${isDarkMode ? 'light' : 'dark'}` },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Raleon],
    });
  };

  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <Tooltip
      title={
        themeMode === 'light'
          ? t('navbar.themes.switchToDark')
          : themeMode === 'dark'
          ? t('navbar.themes.switchToLight')
          : !isDarkModeHook
          ? t('navbar.themes.switchToDark')
          : t('navbar.themes.switchToLight')
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
