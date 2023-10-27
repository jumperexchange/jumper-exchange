import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import LightModeIcon from '@mui/icons-material/LightMode';
import NightlightIcon from '@mui/icons-material/Nightlight';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ButtonSecondary } from '@transferto/shared/src/atoms';
import { Discord, LifiSmallLogo } from '@transferto/shared/src/atoms/icons';
import { ThemeModesSupported } from '@transferto/shared/src/types';
import {
  appendUTMParametersToLink,
  getContrastAlphaColor,
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
import { useMenuStore, useSettingsStore } from '../../stores';
import { EventTrackingTool } from '../../types';

export const useMainMenuContent = () => {
  const { t, i18n } = useTranslation();
  const { trackPageload, trackEvent } = useUserTracking();
  const theme = useTheme();
  const onOpenSupportModal = useMenuStore((state) => state.onOpenSupportModal);

  const [themeMode, onChangeMode] = useSettingsStore((state) => [
    state.themeMode,
    state.onChangeMode,
  ]);

  const explorerUrl = appendUTMParametersToLink('https://explorer.li.fi/', {
    utm_campaign: 'jumper_to_explorer',
    utm_medium: 'menu',
  });

  const lifiUrl = appendUTMParametersToLink('https://li.fi/', {
    utm_campaign: 'jumper_to_lifi',
    utm_medium: 'menu',
  });

  const handleSwitchMode = (mode: ThemeModesSupported) => {
    console.log('MODE', mode);
    trackEvent({
      category: TrackingCategory.ThemeMenu,
      action: TrackingAction.SwitchTheme,
      label: `theme_${mode}`,
      data: {
        [TrackingEventParameter.SwitchedTheme]: mode,
      },
      disableTrackingTool: [EventTrackingTool.ARCx, EventTrackingTool.Cookie3],
    });
    onChangeMode(mode);
  };

  const activeButtonBgCol =
    theme.palette.mode === 'light'
      ? theme.palette.white.main
      : theme.palette.grey[600];

  const inactiveButtonBgCol =
    theme.palette.mode === 'light'
      ? 'transparent'
      : getContrastAlphaColor(theme, '8%');

  const buttonStyles = {
    height: '40px',
    borderRadius: '8px',
    width: '72px',
  };

  return [
    {
      children: (
        <>
          <ButtonSecondary
            styles={{
              ...buttonStyles,
              backgroundColor:
                themeMode === 'light' ? activeButtonBgCol : inactiveButtonBgCol,
            }}
            onClick={() => {
              handleSwitchMode('light');
            }}
          >
            <LightModeIcon
              sx={{
                fill:
                  themeMode === 'light'
                    ? 'currentColor'
                    : theme.palette.grey[700],
              }}
            />
          </ButtonSecondary>
          <ButtonSecondary
            styles={{
              ...buttonStyles,
              backgroundColor:
                themeMode === 'dark' ? activeButtonBgCol : inactiveButtonBgCol,
            }}
            onClick={() => {
              handleSwitchMode('dark');
            }}
          >
            <NightlightIcon
              sx={{
                fill:
                  themeMode === 'dark'
                    ? 'currentColor'
                    : theme.palette.grey[700],
              }}
            />
          </ButtonSecondary>
          <ButtonSecondary
            styles={{
              ...buttonStyles,
              backgroundColor:
                themeMode === 'auto' ? activeButtonBgCol : inactiveButtonBgCol,
            }}
            onClick={() => {
              handleSwitchMode('auto');
            }}
          >
            <BrightnessAutoIcon
              sx={{
                fill:
                  themeMode === 'auto'
                    ? 'currentColor'
                    : theme.palette.grey[700],
              }}
            />
          </ButtonSecondary>
        </>
      ),
      styles: {
        width: '240px',
        margin: '12px auto',
        backgroundColor: theme.palette.grey[200],
        '&:hover': {
          backgroundColor: theme.palette.grey[200],
        },
        paddingTop: '4px !important',
        padding: '4px',
        '> button:hover': {
          backgroundColor:
            theme.palette.mode === 'light'
              ? getContrastAlphaColor(theme, '4%')
              : theme.palette.grey[700],
        },
        '> button:hover svg': {
          fill:
            theme.palette.mode === 'light'
              ? theme.palette.grey[700]
              : theme.palette.grey[300],
        },
      },
      showMoreIcon: false,
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
            EventTrackingTool.ARCx,
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
            EventTrackingTool.ARCx,
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
            EventTrackingTool.ARCx,
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
            EventTrackingTool.ARCx,
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
