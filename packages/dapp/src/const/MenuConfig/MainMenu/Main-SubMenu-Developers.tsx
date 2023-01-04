import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { useTheme } from '@mui/material/styles';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { MenuListItem } from '../../../types';

const MainSubMenuDevelopers = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const _MainSubMenuDevelopers: MenuListItem[] = [
    {
      label: `${translate(`${i18Path}developers.github`)}`,
      listIcon: (
        <GitHubIcon
          sx={{
            color: !!isDarkMode
              ? theme.palette.white.main
              : theme.palette.black.main,
          }}
        />
      ),
      onClick: () => {
        openInNewTab('https://github.com/lifinance/');
      },
    },
    {
      label: `${translate(`${i18Path}developers.documentation`)}`,
      listIcon: <DescriptionOutlinedIcon />,
      onClick: () => {
        openInNewTab('https://docs.li.fi/');
      },
    },
    {
      label: `${translate(`${i18Path}developers.showcases`)}`,
      listIcon: <SlideshowIcon />,
      onClick: () => {
        openInNewTab('#');
      },
    },
  ];

  return _MainSubMenuDevelopers;
};

export default MainSubMenuDevelopers;
