import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Typography } from '@mui/material';
import { Discord } from '@transferto/shared/src/atoms/icons';
import { useSettings } from '@transferto/shared/src/hooks';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useMemo } from 'react';
import { getInitialProps, useTranslation } from 'react-i18next';
import { MenuListItem } from '../../types';

const MainMenuItems = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'Navbar.';
  const settings = useSettings();
  const activeLanguage = useMemo(
    () => getInitialProps().initialLanguage,
    [getInitialProps().initialLanguage],
  );

  const _MainMenuItems: MenuListItem[] = [
    {
      label: `${translate(`${i18Path}NavbarMenu.Language`)}`,
      listIcon: <LanguageIcon />,
      checkIcon: settings.themeMode === 'light',
      extraIcon: (
        <Typography variant="lifiBodyMedium" textTransform={'uppercase'}>
          {activeLanguage}
        </Typography>
      ),
      triggerSubMenu: 'language',
    },
    {
      label: `${translate(`${i18Path}NavbarMenu.Theme`)}`,
      listIcon: <LightModeOutlinedIcon />,
      url: 'https://github.com/lifinance/',
      triggerSubMenu: 'themes',
    },
    {
      label: `${translate(`${i18Path}NavbarMenu.Developers`)}`,
      listIcon: <DeveloperModeIcon />,
      triggerSubMenu: 'devs',
    },
    {
      label: `${translate(`${i18Path}NavbarMenu.AboutLIFI`)}`,
      listIcon: <InfoOutlinedIcon />,
      onClick: () => {
        openInNewTab('https://li.fi');
      },
    },
    {
      label: `${translate(`${i18Path}NavbarMenu.Support`)}`,
      listIcon: <Discord style={{ marginLeft: '9.5px' }} />,
      onClick: () => {
        openInNewTab('https://discord.gg/lifi');
      },
      showButton: true,
    },
  ];

  return _MainMenuItems;
};

export default MainMenuItems;
