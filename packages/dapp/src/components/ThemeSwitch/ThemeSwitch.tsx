import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import { useMediaQuery } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@transferto/dapp/src/const';
import { useTranslation } from 'react-i18next';
import { usePopperIsOpened, useUserTracking } from '../../hooks';
import { useDetectDarkModePreference } from '../../providers/ThemeProvider';
import { useSettingsStore } from '../../stores';
import { EventTrackingTool } from '../../types';
import { ButtonThemeSwitch } from './ThemeSwitch.style';

export const ThemeSwitch = () => {
  const isDarkMode = useDetectDarkModePreference();
  const popperOpened = usePopperIsOpened();

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
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    onChangeMode(changeMode);
  };

  const isDarkModeHook = useMediaQuery('(prefers-color-scheme: dark)');

  return (
    <Tooltip
      disableHoverListener={popperOpened}
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
