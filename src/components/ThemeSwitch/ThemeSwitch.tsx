import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const';
import { useUserTracking } from 'src/hooks';
import { useDetectDarkModePreference } from 'src/providers';
import { useSettingsStore } from 'src/stores';
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
    const changeMode = isDarkMode ? 'light' : 'dark';

    trackEvent({
      category: TrackingCategory.ThemeSwitch,
      action: TrackingAction.SwitchTheme,
      label: `theme_${changeMode}`,
      data: {
        [TrackingEventParameter.SwitchedTheme]: changeMode,
      },
    });
    onChangeMode(changeMode);
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
      arrow
    >
      <ButtonThemeSwitch onClick={handleThemeSwitch}>
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
