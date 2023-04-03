import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import NightlightOutlinedIcon from '@mui/icons-material/NightlightOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Discord, LifiSmallLogo } from '@transferto/shared/src/atoms/icons';
import { useSettings } from '@transferto/shared/src/hooks';
import { openInNewTab } from '@transferto/shared/src/utils/';
import { useTranslation } from 'react-i18next';
import { SubMenuKeys } from '../../../const';
import { EventTrackingTools } from '../../../hooks';
import { useUserTracking } from '../../../hooks/useUserTracking/useUserTracking';
import { useMenu } from '../../../providers/MenuProvider';
import { useDetectDarkModePreference } from '../../../providers/ThemeProvider';

export const useMainMenuItems = () => {
  const { t: translate, i18n } = useTranslation();
  const i18Path = 'navbar.';
  const settings = useSettings();
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const isDarkMode = useDetectDarkModePreference();
  const menu = useMenu();

  return [
    {
      label: `${translate(`${i18Path}navbarMenu.theme`)}`,
      prefixIcon: isDarkMode ? (
        <NightlightOutlinedIcon />
      ) : (
        <LightModeOutlinedIcon />
      ),
      url: 'https://github.com/lifinance/',
      triggerSubMenu: SubMenuKeys.themes,
    },
    {
      label: `${translate(`${i18Path}language.key`)}`,
      prefixIcon: <LanguageIcon />,
      checkIcon: settings.themeMode === 'light',
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
      triggerSubMenu: SubMenuKeys.language,
    },
    {
      label: `${translate(`${i18Path}navbarMenu.developers`)}`,
      prefixIcon: <DeveloperModeIcon />,
      triggerSubMenu: SubMenuKeys.devs,
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
          category: 'menu',
          action: 'open-support-modal',
          disableTrackingTool: [EventTrackingTools.arcx],
        });
        menu.toggleSupportModal(true);
      },
      showButton: true,
    },
  ];
};
