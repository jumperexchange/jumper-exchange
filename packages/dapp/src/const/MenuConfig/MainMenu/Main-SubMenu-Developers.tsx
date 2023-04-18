import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { useTheme } from '@mui/material/styles';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { EventTrackingTools } from '../../../hooks';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';

export const useMainSubMenuDevelopers = () => {
  const { t: translate } = useTranslation();
  const i18Path = 'navbar.';
  const { trackPageload } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  return [
    {
      label: `${translate(`${i18Path}developers.github`)}`,
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
          disableTrackingTool: [EventTrackingTools.arcx],
        });
      },
    },
    {
      label: `${translate(`${i18Path}developers.documentation`)}`,
      prefixIcon: <DescriptionOutlinedIcon />,
      onClick: () => {
        openInNewTab('https://docs.li.fi/');
        trackPageload({
          source: 'menu',
          destination: 'lifi-docs',
          url: 'https://docs.li.fi/',
          pageload: true,
          disableTrackingTool: [EventTrackingTools.arcx],
        });
      },
    },
    {
      label: `${translate(`${i18Path}developers.showcases`)}`,
      prefixIcon: <SlideshowIcon />,
      showMoreIcon: true,
      triggerSubMenu: 'showcases',
    },
  ];
};
