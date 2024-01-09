import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { Discord, LIFIicon, Tabs } from 'src/components';
import { useUserTracking } from 'src/hooks';
import { useMenuStore, useSettingsStore } from 'src/stores';
import { EventTrackingTool } from 'src/types';
import { getContrastAlphaColor, openInNewTab } from 'src/utils';
import { appendUTMParametersToLink } from 'src/utils/append-utm-params-to-link';
import {
  DISCORD_URL,
  EXPLORER_URL,
  LIFI_URL,
  MenuKeys,
  TWITTER_URL,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
  useThemeSwitchTabs,
} from '../../../const';

export const useMainMenuContent = () => {
  const { t, i18n } = useTranslation();
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const onOpenSupportModal = useMenuStore((state) => state.onOpenSupportModal);
  const themeMode = useSettingsStore((state) => state.themeMode);
  const explorerUrl = appendUTMParametersToLink(EXPLORER_URL, {
    utm_campaign: 'jumper_to_explorer',
    utm_medium: 'menu',
  });

  const lifiUrl = appendUTMParametersToLink(LIFI_URL, {
    utm_campaign: 'jumper_to_lifi',
    utm_medium: 'menu',
  });

  const themeSwitchTabs = useThemeSwitchTabs();

  const containerStyles = {
    display: 'flex',
    width: '100%',
    borderRadius: '24px',
    div: {
      height: 38,
    },
    '.MuiTabs-indicator': {
      height: 38,
      zIndex: -1,
      borderRadius: '18px',
    },
  };

  const tabStyles = {
    height: 38,
    margin: theme.spacing(0.75),
    minWidth: 'unset',
    borderRadius: '18px',
  };

  return [
    {
      children: (
        <Tabs
          data={themeSwitchTabs}
          value={themeMode === 'light' ? 0 : themeMode === 'dark' ? 1 : 2}
          ariaLabel="theme-switch-tabs"
          containerStyles={containerStyles}
          tabStyles={tabStyles}
        />
      ),
      styles: {
        width: 'auto',
        margin: theme.spacing(1.5),
        gap: '8px',
        backgroundColor: 'transparent',
        borderRadius: '24px',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        paddingTop: `${theme.spacing(0.5)} !important`,
        padding: theme.spacing(0.5),
        '> button:hover': {
          backgroundColor: getContrastAlphaColor(theme, '4%'),
        },
        '> button:hover svg': {
          fill:
            theme.palette.mode === 'light'
              ? theme.palette.grey[700]
              : theme.palette.grey[300],
        },
      },
      showMoreIcon: false,
      disableRipple: true,
    },
    {
      label: t('language.key', { ns: 'language' }),
      prefixIcon: <LanguageIcon />,
      suffixIcon: (
        <Typography
          variant="lifiBodyMedium"
          textTransform={'uppercase'}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 38,
          }}
        >
          {i18n.resolvedLanguage}
        </Typography>
      ),
      showMoreIcon: true,
      triggerSubMenu: MenuKeys.Language,
    },
    {
      label: t('navbar.navbarMenu.developers'),
      prefixIcon: <DeveloperModeIcon />,
      triggerSubMenu: MenuKeys.Devs,
    },
    {
      label: 'Twitter',
      prefixIcon: <TwitterIcon />,
      showMoreIcon: false,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-lifi-link',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_twitter' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        trackPageload({
          source: TrackingCategory.MainMenu,
          destination: 'twitter-jumper',
          url: TWITTER_URL,
          pageload: true,
          disableTrackingTool: [EventTrackingTool.Cookie3],
        });
        openInNewTab(TWITTER_URL);
      },
    },
    {
      label: 'Discord',
      prefixIcon: (
        <Discord
          color={
            theme.palette.mode === 'dark'
              ? theme.palette.white.main
              : theme.palette.black.main
          }
        />
      ),
      showMoreIcon: false,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-discord-link',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_discord' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        trackPageload({
          source: TrackingCategory.Menu,
          destination: 'discord-lifi',
          url: DISCORD_URL,
          pageload: true,
          disableTrackingTool: [EventTrackingTool.Cookie3],
        });
        openInNewTab(DISCORD_URL);
      },
    },
    {
      label: t('navbar.navbarMenu.lifiExplorer'),
      prefixIcon: <SearchOutlinedIcon />,
      showMoreIcon: false,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'open-lifi-explorer',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_explorer' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        trackPageload({
          source: TrackingCategory.Menu,
          destination: 'lifi-explorer',
          url: explorerUrl,
          pageload: true,
          disableTrackingTool: [EventTrackingTool.Cookie3],
        });
        openInNewTab(explorerUrl);
      },
    },
    {
      label: t('navbar.navbarMenu.aboutLIFI'),
      prefixIcon: (
        <LIFIicon
          styles={{ flexShrink: 0 }}
          color={
            theme.palette.mode === 'dark'
              ? theme.palette.white.main
              : theme.palette.black.main
          }
        />
      ),
      showMoreIcon: false,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-lifi-link',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'lifi_website' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        trackPageload({
          source: TrackingCategory.Menu,
          destination: 'lifi-website',
          url: lifiUrl,
          pageload: true,
          disableTrackingTool: [EventTrackingTool.Cookie3],
        });
        openInNewTab(lifiUrl);
      },
    },
    {
      label: t('navbar.navbarMenu.support'),
      prefixIcon: <Discord color={theme.palette.white.main} />,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'open-support-modal',
          action: TrackingAction.OpenMenu,
          data: { [TrackingEventParameter.Menu]: 'support_modal' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
        });
        onOpenSupportModal(true);
      },
      showButton: true,
    },
  ];
};
