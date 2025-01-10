import { useMenuStore } from '@/stores/menu';
import FolderZipOutlinedIcon from '@mui/icons-material/FolderZipOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useTheme } from '@mui/material/styles';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '../../../const/trackingKeys';

import { GITHUB_URL } from '@/const/urls';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useTranslation } from 'react-i18next';
export const useDevelopersContent = () => {
  const { t } = useTranslation();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const closeAllMenus = useMenuStore((state) => state.closeAllMenus);

  return [
    {
      label: t('navbar.developers.github'),
      prefixIcon: (
        <GitHubIcon
          sx={{
            color: theme.palette.text.primary,
          }}
        />
      ),
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Pageload,
          action: TrackingAction.PageLoad,
          label: 'pageload-jumper-github',
          data: {
            [TrackingEventParameter.PageloadSource]: TrackingCategory.Menu,
            [TrackingEventParameter.PageloadDestination]: 'jumper-github',
            [TrackingEventParameter.PageloadURL]: GITHUB_URL,
            [TrackingEventParameter.PageloadExternal]: true,
          },
        });
        closeAllMenus();
      },
      link: { url: GITHUB_URL, external: true },
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
        });
        closeAllMenus();
      },
      link: { url: '/jumper_brand_assets.zip', external: true },
    },
  ];
};
