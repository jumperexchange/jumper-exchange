import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { useTheme } from '@mui/material/styles';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { MenuKeys } from '..';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';
export const useDevelopersContent = () => {
  const { t: translate } = useTranslation();
  const { trackPageload } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );

  return [
    {
      label: translate('navbar.developers.github', 'translation'),
      prefixIcon: (
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
        trackPageload({
          source: 'menu',
          destination: 'lifi-github',
          url: 'https://github.com/lifinance/',
          pageload: true,
          disableTrackingTool: [EventTrackingTool.ARCx],
        });
        onCloseAllNavbarMenus();
      },
    },
    {
      label: translate('navbar.developers.documentation', 'translation'),
      prefixIcon: <DescriptionOutlinedIcon />,
      onClick: () => {
        openInNewTab('https://docs.li.fi/');
        trackPageload({
          source: 'menu',
          destination: 'lifi-docs',
          url: 'https://docs.li.fi/',
          pageload: true,
          disableTrackingTool: [EventTrackingTool.ARCx],
        });
        onCloseAllNavbarMenus();
      },
    },
    {
      label: translate('navbar.developers.showcases', 'translation'),
      prefixIcon: <SlideshowIcon />,
      showMoreIcon: true,
      triggerSubMenu: MenuKeys.Showcases,
    },
  ];
};
