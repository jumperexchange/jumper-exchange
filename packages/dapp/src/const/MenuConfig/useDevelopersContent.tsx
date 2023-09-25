import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTheme } from '@mui/material/styles';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';
import {
  TrackingActions,
  TrackingCategories,
  TrackingEventParameters,
} from '../trackingKeys';
export const useDevelopersContent = () => {
  const { t } = useTranslation();
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const onCloseAllNavbarMenus = useMenuStore(
    (state) => state.onCloseAllNavbarMenus,
  );

  return [
    {
      label: t('navbar.developers.github'),
      prefixIcon: (
        <GitHubIcon
          sx={{
            color: isDarkMode
              ? theme.palette.white.main
              : theme.palette.black.main,
          }}
        />
      ),
      onClick: () => {
        const githubUrl = 'https://github.com/lifinance/';
        trackEvent({
          category: TrackingCategories.Menu,
          label: 'open-lifi-github',
          action: TrackingActions.OpenMenu,
          data: { [TrackingEventParameters.Menu]: 'lifi_github' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        trackPageload({
          source: 'menu',
          destination: 'lifi-github',
          url: githubUrl,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        openInNewTab(githubUrl);
        onCloseAllNavbarMenus();
      },
    },
    {
      label: t('navbar.developers.documentation'),
      prefixIcon: <DescriptionOutlinedIcon />,
      onClick: () => {
        const docsUrl = 'https://docs.li.fi/';
        trackEvent({
          category: TrackingCategories.Menu,
          label: 'open-lifi-docs',
          action: TrackingActions.OpenMenu,
          data: { [TrackingEventParameters.Menu]: 'lifi_docs' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        trackPageload({
          source: 'menu',
          destination: 'lifi-docs',
          url: docsUrl,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        openInNewTab(docsUrl);
        onCloseAllNavbarMenus();
      },
    },
  ];
};
