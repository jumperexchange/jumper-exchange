import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Discord, LifiSmallLogo } from '@transferto/shared/src/atoms/icons';
import { useSettings } from '@transferto/shared/src/hooks';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useMemo } from 'react';
import { getInitialProps, useTranslation } from 'react-i18next';
import { SubMenuKeys } from '../../../const';
import { useMenu } from '../../../providers/MenuProvider';
import { MenuListItem } from '../../../types';

const MainMenuItems = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const settings = useSettings();
  const theme = useTheme();
  const activeLanguage = useMemo(
    () => getInitialProps().initialLanguage,
    [getInitialProps().initialLanguage],
  );
  const menu = useMenu();

  const _MainMenuItems: MenuListItem[] = [
    {
      label: `${translate(`${i18Path}navbarMenu.theme`)}`,
      prefixIcon:
        settings.themeMode === 'light' ? (
          <LightModeOutlinedIcon />
        ) : (
          <NightlightOutlinedIcon />
        ),
      url: 'https://github.com/lifinance/',
      triggerSubMenu: SubMenuKeys.themes,
    },
    {
      label: `${translate(`${i18Path}language.key`)}`,
      prefixIcon: <LanguageIcon />,
      checkIcon: settings.themeMode === 'light',
      suffixIcon: (
        <Typography variant="lifiBodyMedium" textTransform={'uppercase'}>
          {activeLanguage}
        </Typography>
      ),
      triggerSubMenu: SubMenuKeys.language,
    },
    {
      label: `${translate(`${i18Path}navbarMenu.developers`)}`,
      prefixIcon: <DeveloperModeIcon />,
      triggerSubMenu: SubMenuKeys.devs,
    },
    {
      label: `${translate(`${i18Path}navbarMenu.aboutLIFI`)}`,
      prefixIcon: (
        <LifiSmallLogo
          color={
            theme.palette.mode === 'dark'
              ? theme.palette.white.main
              : theme.palette.black.main
          }
        />
      ),
      showMoreIcon: false,
      onClick: () => {
        openInNewTab('https://li.fi');
      },
    },
    {
      label: `${translate(`${i18Path}navbarMenu.support`)}`,
      prefixIcon: <Discord color={theme.palette.white.main} />,
      onClick: () => {
        menu.toggleSupportModal(true);
      },
      showButton: true,
    },
  ];

  return _MainMenuItems;
};

export default MainMenuItems;
