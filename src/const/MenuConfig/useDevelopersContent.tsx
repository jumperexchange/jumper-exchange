import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
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
} from '../trackingKeys';

export const useDevelopersContent = () => {
  const { t } = useTranslation();
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const onCloseAllPopperMenus = useMenuStore(
    (state) => state.onCloseAllPopperMenus,
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
        onCloseAllPopperMenus();
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
        onCloseAllPopperMenus();
      },
    },
  ];
};
