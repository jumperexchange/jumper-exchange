import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { useSettings } from '@transferto/shared/src/hooks';
import { ThemeModesSupported } from '@transferto/shared/src/types/settings';
import { useTranslation } from 'react-i18next';
import { MenuListItem } from '../../../types';

const MainSubMenuTheme = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const settings = useSettings();

  const handleSwitchMode = (mode: ThemeModesSupported) => {
    settings.onChangeMode(mode);
  };

  const _MainSubMenuTheme: MenuListItem[] = [
    {
      label: `${translate(`${i18Path}themes.light`)}`,
      listIcon: <LightModeIcon />,
      checkIcon: settings.themeMode === 'light',
      onClick: () => handleSwitchMode('light'),
    },
    {
      label: `${translate(`${i18Path}themes.dark`)}`,
      listIcon: <NightlightOutlinedIcon />,
      checkIcon: settings.themeMode === 'dark',
      onClick: () => handleSwitchMode('dark'),
    },
    {
      label: `${translate(`${i18Path}themes.auto`)}`,
      listIcon: <BrightnessAutoOutlinedIcon />,
      checkIcon: settings.themeMode === 'auto',
      onClick: () => handleSwitchMode('auto'),
    },
  ];

  return _MainSubMenuTheme;
};

export default MainSubMenuTheme;
