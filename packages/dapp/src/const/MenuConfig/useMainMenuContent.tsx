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
import {
  MenuKeys,
  TrackingActions,
  TrackingCategories,
  TrackingEventParameters,
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
        openInNewTab('https://twitter.com/JumperExchange');
        trackPageload({
          source: TrackingCategories.MainMenu,
          destination: 'twitter-JumperExchange',
          url: 'https://twitter.com/JumperExchange',
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
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
        openInNewTab('https://discord.gg/lifi');
        trackPageload({
          source: TrackingCategories.Menu,
          destination: 'discord-lifi',
          url: 'https://discord.gg/lifi',
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
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
        trackPageload({
          source: TrackingCategories.Menu,
          destination: 'lifi-website',
          url: 'https://li.fi',
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        openInNewTab('https://li.fi');
      },
    },
    {
      label: t('navbar.navbarMenu.support'),
      prefixIcon: <Discord color={theme.palette.white.main} />,
      onClick: () => {
        trackEvent({
          category: TrackingCategories.Menu,
          label: 'open-support-modal',
          action: TrackingActions.OpenSupportModal,
          data: { [TrackingEventParameters.SubMenu]: 'support_modal' },
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Raleon,
          ],
        });
        onOpenSupportModal(true);
      },
      showButton: true,
    },
  ];
};
