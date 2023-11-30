import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useUserTracking } from 'src/hooks';
import { useMenuStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { openInNewTab } from 'src/utils';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '../../../const/trackingKeys';

import { DOCS_URL, GITHUB_URL } from '../../../const/urls';
export const useDevelopersContent = () => {
  const { t } = useTranslation();
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const onCloseAllMenus = useMenuStore((state) => state.onCloseAllMenus);

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
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'open-lifi-github',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_github' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        trackPageload({
          source: TrackingCategory.Menu,
          destination: 'lifi-github',
          url: GITHUB_URL,
          pageload: true,
          disableTrackingTool: [EventTrackingTool.Cookie3],
        });
        openInNewTab(GITHUB_URL);
        onCloseAllMenus();
      },
    },
    {
      label: t('navbar.developers.documentation'),
      prefixIcon: <DescriptionOutlinedIcon />,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'open-lifi-docs',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_docs' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        trackPageload({
          source: TrackingCategory.Menu,
          destination: 'lifi-docs',
          url: DOCS_URL,
          pageload: true,
          disableTrackingTool: [EventTrackingTool.Cookie3],
        });
        openInNewTab(DOCS_URL);
        onCloseAllMenus();
      },
    },
    {
      label: t('navbar.navbarMenu.brandAssets'),
      prefixIcon: <FolderZipOutlinedIcon />,
      showMoreIcon: false,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-brand-assets',
          action: TrackingAction.DownloadBrandAssets,
          data: { [TrackingEventParameter.Menu]: 'brand_assets' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        openInNewTab('/jumper_brand_assets.zip');
      },
    },
  ];
};
