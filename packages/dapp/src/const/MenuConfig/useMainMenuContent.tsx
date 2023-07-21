import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Discord, LifiSmallLogo } from '@transferto/shared/src/atoms/icons';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { MenuKeys, TrackingActions, TrackingCategories } from '..';
import { useUserTracking } from '../../hooks';
import { useDetectDarkModePreference } from '../../providers/ThemeProvider';
import { useMenuStore, useSettingsStore } from '../../stores';
import { EventTrackingTools } from '../../types';

export const useMainMenuContent = () => {
  const { t: translate, i18n } = useTranslation();
  const i18Path = 'navbar.';
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = useDetectDarkModePreference();
  const themeMode = useSettingsStore((state) => state.themeMode);
  const onOpenSupportModal = useMenuStore((state) => state.onOpenSupportModal);

  return [
    {
      label: `${translate(`${i18Path}navbarMenu.theme`)}`,
      prefixIcon: isDarkMode ? (
        <NightlightOutlinedIcon />
      ) : (
        <LightModeOutlinedIcon />
      ),
      url: 'https://github.com/lifinance/',
      triggerSubMenu: MenuKeys.Themes,
    },
    {
      label: `${translate(`${i18Path}language.key`)}`,
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
      label: `${translate(`${i18Path}navbarMenu.developers`)}`,
      prefixIcon: <DeveloperModeIcon />,
      triggerSubMenu: MenuKeys.Devs,
    },
    {
      label: `Twitter`,
      prefixIcon: <TwitterIcon />,
      showMoreIcon: false,
      onClick: () => {
        openInNewTab('https://twitter.com/JumperExchange');
        trackPageload({
          source: 'menu',
          destination: 'twitter-JumperExchange',
          url: 'https://twitter.com/JumperExchange',
          pageload: true,
          disableTrackingTool: [EventTrackingTools.arcx],
        });
      },
    },
    {
      label: `Discord`,
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
        openInNewTab('https://discord.gg/lifi');
        trackPageload({
          source: 'menu',
          destination: 'discord-lifi',
          url: 'https://discord.gg/lifi',
          pageload: true,
          disableTrackingTool: [EventTrackingTools.arcx],
        });
      },
    },
    {
      label: `${translate(`${i18Path}navbarMenu.aboutLIFI`)}`,
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
        trackPageload({
          source: 'menu',
          destination: 'lifi-website',
          url: 'https://li.fi',
          pageload: true,
          disableTrackingTool: [EventTrackingTools.arcx],
        });
        openInNewTab('https://li.fi');
      },
    },
    {
      label: `${translate(`${i18Path}navbarMenu.support`)}`,
      prefixIcon: <Discord color={theme.palette.white.main} />,
      onClick: () => {
        trackEvent({
          category: TrackingCategories.SupportModal,
          action: TrackingActions.OpenSupportModal,
          disableTrackingTool: [
            EventTrackingTools.arcx,
            EventTrackingTools.raleon,
          ],
        });
        onOpenSupportModal(true);
      },
      showButton: true,
    },
  ];
};
