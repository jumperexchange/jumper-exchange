import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import Tooltip from '@mui/material/Tooltip';
import { useTranslation } from 'react-i18next';
import { useDetectDarkModePreference } from '../../../../dapp/src/providers/ThemeProvider';
import { useSettings } from '../../hooks';
import { ButtonThemeSwitch } from './ThemeSwitch.style';
export const ThemeSwitch = () => {
  const isDarkMode = useDetectDarkModePreference();
  const settings = useSettings();
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';

  const handleThemeSwitch = () => {
    settings.onChangeMode(isDarkMode ? 'light' : 'dark');
  };

  return (
    <Tooltip
      title={
        settings.themeMode === 'light'
          ? translate(`${i18Path}themes.light`)
          : settings.themeMode === 'dark'
          ? translate(`${i18Path}themes.dark`)
          : translate(`${i18Path}themes.auto`)
      }
    >
      <ButtonThemeSwitch
        onClick={() => {
          handleThemeSwitch();
        }}
      >
        {settings.themeMode === 'light' ? (
          <LightModeIcon />
        ) : settings.themeMode === 'dark' ? (
          <NightlightIcon />
        ) : (
          <BrightnessAutoIcon />
        )}
      </ButtonThemeSwitch>
    </Tooltip>
  );
};
