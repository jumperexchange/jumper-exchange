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
  DISCORD_URL,
  EXPLORER_URL,
  LIFI_URL,
  MenuKeys,
  TWITTER_URL,
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '..';
import { Tooltip } from '../../components/Tooltip';
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

  const explorerUrl = appendUTMParametersToLink(EXPLORER_URL, {
    utm_campaign: 'jumper_to_explorer',
    utm_medium: 'menu',
  });

  const lifiUrl = appendUTMParametersToLink(LIFI_URL, {
    utm_campaign: 'jumper_to_lifi',
    utm_medium: 'menu',
  });

  const handleSwitchMode = (mode: ThemeModesSupported) => {
    trackEvent({
      category: TrackingCategory.ThemeSection,
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
    theme.palette.mode === 'dark'
      ? theme.palette.alphaLight300.main
      : theme.palette.white.main;

  const inactiveButtonBgCol = 'transparent';

  const buttonStyles = {
    height: '40px',
    borderRadius: '8px',
    flexGrow: '1',
  };

  const popperProps = {
    sx: {
      zIndex: 1600,
    },
  };

  return [
    {
      children: (
        <>
          <Tooltip
            title={t('navbar.themes.switchToLight')}
            popperProps={popperProps}
          >
            <ButtonSecondary
              styles={{
                ...buttonStyles,
                backgroundColor:
                  themeMode === 'light'
                    ? activeButtonBgCol
                    : inactiveButtonBgCol,
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
          </Tooltip>
          <Tooltip
            title={t('navbar.themes.switchToDark')}
            popperProps={popperProps}
          >
            <ButtonSecondary
              styles={{
                ...buttonStyles,
                backgroundColor:
                  themeMode === 'dark'
                    ? activeButtonBgCol
                    : inactiveButtonBgCol,
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
          </Tooltip>
          <Tooltip
            title={t('navbar.themes.switchToSystem')}
            popperProps={popperProps}
          >
            <ButtonSecondary
              styles={{
                ...buttonStyles,
                backgroundColor:
                  themeMode === 'auto'
                    ? activeButtonBgCol
                    : inactiveButtonBgCol,
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
          </Tooltip>
        </>
      ),
      styles: {
        width: 'auto',
        margin: '12px 24px',
        gap: '8px',
        backgroundColor:
          theme.palette.mode === 'dark'
            ? getContrastAlphaColor(theme, '12%')
            : getContrastAlphaColor(theme, '4%'),
        '&:hover': {
          backgroundColor:
            theme.palette.mode === 'dark'
              ? getContrastAlphaColor(theme, '12%')
              : getContrastAlphaColor(theme, '4%'),
        },
        paddingTop: '4px !important',
        padding: '4px',
        '> button:hover': {
          backgroundColor: getContrastAlphaColor(theme, '4%'),
        },
        '> button:hover svg': {
          fill:
            theme.palette.mode === 'light'
              ? theme.palette.grey[700]
              : theme.palette.grey[300],
        },
        '> div': {
          display: 'none',
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
          destination: 'twitter-jumper',
          url: TWITTER_URL,
          pageload: true,
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
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
          disableTrackingTool: [
            EventTrackingTool.ARCx,
            EventTrackingTool.Cookie3,
          ],
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
