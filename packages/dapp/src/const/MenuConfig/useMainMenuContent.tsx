import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Discord, LifiSmallLogo } from '@transferto/shared/src/atoms/icons';
import {
  appendUTMParametersToLink,
  openInNewTab,
} from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import {
  MenuKeys,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '..';
import { useUserTracking } from '../../hooks';
import { useDetectDarkModePreference } from '../../providers/ThemeProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { EventTrackingTool } from '../../types';

export const useMainMenuContent = () => {
  const { t, i18n } = useTranslation();
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = useDetectDarkModePreference();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const onOpenSupportModal = useMenuStore((state) => state.onOpenSupportModal);

  const explorerUrl = appendUTMParametersToLink('https://explorer.li.fi/', {
    utm_campaign: 'jumper_to_explorer',
    utm_medium: 'menu',
  });

  const lifiUrl = appendUTMParametersToLink('https://li.fi/', {
    utm_campaign: 'jumper_to_lifi',
    utm_medium: 'menu',
  });

  return [
    {
      label: t('navbar.navbarMenu.theme'),
      prefixIcon: isDarkMode ? (
        <NightlightOutlinedIcon />
      ) : (
        <LightModeOutlinedIcon />
      ),
      url: 'https://github.com/lifinance/',
      triggerSubMenu: MenuKeys.Themes,
    },
    {
      label: t('language.key', { ns: 'language' }),
      prefixIcon: <LanguageIcon />,
      checkIcon: themeMode === 'light',
      suffixIcon: (
        <Typography
          variant="lifiBodyMedium"
          textTransform={'uppercase'}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '38px',
          }}
        >
          {i18n.resolvedLanguage}
        </Typography>
      ),
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
          destination: 'twitter-JumperExchange',
          url: 'https://twitter.com/JumperExchange',
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.Cookie3,
          ],
        });
        openInNewTab('https://twitter.com/JumperExchange');
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
          url: 'https://discord.gg/lifi',
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.Cookie3,
          ],
        });
        openInNewTab('https://discord.gg/lifi');
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
          source: 'menu',
          destination: 'lifi-explorer',
          url: explorerUrl,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.Cookie3,
          ],
        });
        openInNewTab(explorerUrl);
      },
    },
    {
      label: t('navbar.navbarMenu.aboutLIFI'),
      prefixIcon: (
        <LifiSmallLogo
          style={{ flexShrink: 0 }}
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
          disableTrackingTool: [
            EventTrackingTool.Cookie3,
          ],
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
