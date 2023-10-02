import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useTheme } from '@mui/material/styles';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from '../../hooks';
import { useMenuStore } from '../../stores';
import { EventTrackingTool } from '../../types';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
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
          category: TrackingCategory.Menu,
          label: 'open-lifi-github',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_github' },
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
          category: TrackingCategory.Menu,
          label: 'open-lifi-docs',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_docs' },
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
    {
      label: t('navbar.developers.explorer'),
      prefixIcon: <SearchOutlinedIcon />,
      onClick: () => {
        const explorerUrl = 'https://explorer.li.fi?utm_source=jumper';
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'open-lifi-explorer',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_explorer' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        trackPageload({
          source: 'menu',
          destination: 'lifi-explorer',
          url: explorerUrl,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        openInNewTab(explorerUrl);
        onCloseAllNavbarMenus();
      },
    },
  ];
};
