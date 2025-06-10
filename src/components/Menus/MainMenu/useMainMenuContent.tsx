import { useMemo, useCallback } from 'react';
import { Discord } from '@/components/illustrations/Discord';
import { Link3Icon } from '@/components/illustrations/Link3Icon';
import { MenuKeysEnum } from '@/const/menuKeys';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import {
  DISCORD_URL,
  JUMPER_LEARN_PATH,
  JUMPER_SCAN_PATH,
  LINK3_URL,
  TELEGRAM_URL,
  X_URL,
} from '@/const/urls';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu';
import { useThemeStore } from '@/stores/theme';
import FolderOpen from '@mui/icons-material/FolderOpen';
import LanguageIcon from '@mui/icons-material/Language';
import SchoolIcon from '@mui/icons-material/School';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import XIcon from '@mui/icons-material/X';
import { Telegram } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useThemeModesMenuContent } from '../ThemeModesSubMenu/useThemeModesMenuContent';

interface MenuLink {
  url: string;
  external?: boolean;
}

interface MenuItem {
  label: string;
  prefixIcon: React.JSX.Element | string;
  suffixIcon?: React.JSX.Element | string;
  showMoreIcon?: boolean;
  link?: MenuLink;
  triggerSubMenu?: MenuKeysEnum;
  onClick: () => void;
}

const enum SocialLinkLabel {
  TELEGRAM = 'Telegram',
  DISCORD = 'Discord',
  LINK3 = 'Link3',
  X = 'X',
}

interface SocialLink {
  label: string;
  prefixIcon: React.JSX.Element | string;
  link: MenuLink;
  onClick: () => void;
}

export const useMainMenuContent = () => {
  const { t, i18n } = useTranslation();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const [configTheme] = useThemeStore((state) => [state.configTheme]);
  const { selectedThemeIcon } = useThemeModesMenuContent();
  const { setSupportModalState, setSubMenuState, closeAllMenus } = useMenuStore(
    (state) => state,
  );

  const trackPageLoad = useCallback(
    ({
      destination,
      url,
      source = TrackingCategory.Menu,
    }: {
      destination: string;
      url: string;
      source?: TrackingCategory;
    }) => {
      trackEvent({
        category: TrackingCategory.Pageload,
        action: TrackingAction.PageLoad,
        label: `pageload-${destination}`,
        data: {
          [TrackingEventParameter.PageloadSource]: source,
          [TrackingEventParameter.PageloadDestination]: destination,
          [TrackingEventParameter.PageloadURL]: url,
          [TrackingEventParameter.PageloadExternal]: true,
        },
      });
    },
    [trackEvent],
  );

  const trackMenuClick = useCallback(
    ({
      label,
      action,
      dataMenuParam,
    }: {
      label: string;
      action: TrackingAction;
      dataMenuParam: string;
    }) => {
      trackEvent({
        category: TrackingCategory.Menu,
        label,
        action,
        data: { [TrackingEventParameter.Menu]: dataMenuParam },
      });
    },
    [trackEvent],
  );

  const handleLearnClick = useCallback(() => {
    trackMenuClick({
      label: 'click-jumper-learn-link',
      action: TrackingAction.ClickJumperLearnLink,
      dataMenuParam: 'jumper_learn',
    });
    closeAllMenus();
  }, [trackMenuClick, closeAllMenus]);

  const handleScanClick = useCallback(() => {
    trackMenuClick({
      label: 'open-jumper-scan',
      action: TrackingAction.ClickJumperScanLink,
      dataMenuParam: 'jumper_scan',
    });
    closeAllMenus();
  }, [trackMenuClick, closeAllMenus]);

  const handleSupportClick = useCallback(() => {
    setSupportModalState(true);
  }, [setSupportModalState]);

  const handleThemeClick = useCallback(() => {
    setSubMenuState(MenuKeysEnum.ThemeMode);
  }, [setSubMenuState]);

  const handleLanguageClick = useCallback(() => {
    setSubMenuState(MenuKeysEnum.Language);
  }, [setSubMenuState]);

  const handleResourcesClick = useCallback(() => {
    setSubMenuState(MenuKeysEnum.Devs);
    trackEvent({
      category: TrackingCategory.MainMenu,
      action: TrackingAction.OpenMenu,
      label: `open_submenu_${MenuKeysEnum.Devs.toLowerCase()}`,
      data: { [TrackingEventParameter.Menu]: MenuKeysEnum.Devs },
    });
  }, [setSubMenuState, trackEvent]);

  const socialLinkIconStyle = useMemo(
    () => ({
      color: (theme.vars || theme).palette.alphaLight500.main,
      ...theme.applyStyles('light', {
        color: theme.palette.alphaDark500.main,
      }),
    }),
    [theme],
  );

  const createSocialLink = useCallback(
    ({
      label,
      icon,
      url,
      trackingKey,
      action,
    }: {
      label: string;
      icon: React.JSX.Element | string;
      url: string;
      trackingKey: string;
      action: TrackingAction;
    }): SocialLink => ({
      label,
      prefixIcon: icon,
      link: { url, external: true },
      onClick: () => {
        trackMenuClick({
          label: `click-${trackingKey}-link`,
          dataMenuParam: `${trackingKey}-jumper`,
          action,
        });
        trackPageLoad({
          destination: `${trackingKey}_jumper`,
          url,
          source: TrackingCategory.MainMenu,
        });
      },
    }),
    [trackMenuClick, trackPageLoad],
  );

  const languageSuffixIcon = useMemo(
    () => (
      <Typography
        variant="bodyMedium"
        textTransform="uppercase"
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 38,
        }}
      >
        {i18n.language}
      </Typography>
    ),
    [i18n.language],
  );

  const discordSupportIcon = useMemo(
    () => (
      <Discord sx={{ color: (theme.vars || theme).palette.text.primary }} />
    ),
    [theme],
  );

  const mainMenuItems: MenuItem[] = useMemo(() => {
    const baseItems: MenuItem[] = [
      {
        label: t('navbar.navbarMenu.learn'),
        prefixIcon: <SchoolIcon />,
        showMoreIcon: false,
        link: { url: JUMPER_LEARN_PATH },
        onClick: handleLearnClick,
      },
      {
        label: t('navbar.navbarMenu.scan'),
        prefixIcon: <SearchOutlinedIcon />,
        showMoreIcon: false,
        link: { url: JUMPER_SCAN_PATH, external: false },
        onClick: handleScanClick,
      },
      {
        label: t('navbar.navbarMenu.support'),
        prefixIcon: discordSupportIcon,
        showMoreIcon: false,
        onClick: handleSupportClick,
      },
    ];

    // Conditionally add theme menu item
    if (configTheme?.hasThemeModeSwitch) {
      baseItems.push({
        label: t('navbar.navbarMenu.theme'),
        prefixIcon: selectedThemeIcon,
        showMoreIcon: true,
        triggerSubMenu: MenuKeysEnum.ThemeMode,
        onClick: handleThemeClick,
      });
    }

    baseItems.push(
      {
        label: t('language.key', { ns: 'language' }),
        prefixIcon: <LanguageIcon />,
        showMoreIcon: true,
        triggerSubMenu: MenuKeysEnum.Language,
        suffixIcon: languageSuffixIcon,
        onClick: handleLanguageClick,
      },
      {
        label: t('navbar.navbarMenu.resources'),
        prefixIcon: <FolderOpen />,
        showMoreIcon: true,
        triggerSubMenu: MenuKeysEnum.Devs,
        onClick: handleResourcesClick,
      },
    );

    return baseItems;
  }, [
    t,
    handleLearnClick,
    handleScanClick,
    discordSupportIcon,
    handleSupportClick,
    configTheme?.hasThemeModeSwitch,
    selectedThemeIcon,
    handleThemeClick,
    languageSuffixIcon,
    handleLanguageClick,
    handleResourcesClick,
  ]);

  const mainMenuSocialLinks: SocialLink[] = useMemo(
    () => [
      createSocialLink({
        label: SocialLinkLabel.X,
        icon: <XIcon sx={socialLinkIconStyle} />,
        url: X_URL,
        trackingKey: SocialLinkLabel.X.toLowerCase(),
        action: TrackingAction.ClickXLink,
      }),
      createSocialLink({
        label: SocialLinkLabel.DISCORD,
        icon: <Discord sx={socialLinkIconStyle} />,
        url: DISCORD_URL,
        trackingKey: SocialLinkLabel.DISCORD.toLowerCase(),
        action: TrackingAction.ClickDiscordLink,
      }),
      createSocialLink({
        label: SocialLinkLabel.TELEGRAM,
        icon: <Telegram sx={socialLinkIconStyle} />,
        url: TELEGRAM_URL,
        trackingKey: SocialLinkLabel.TELEGRAM.toLowerCase(),
        action: TrackingAction.ClickTelegramLink,
      }),
      createSocialLink({
        label: SocialLinkLabel.LINK3,
        icon: <Link3Icon sx={socialLinkIconStyle} />,
        url: LINK3_URL,
        trackingKey: SocialLinkLabel.LINK3.toLowerCase(),
        action: TrackingAction.ClickLink3Link,
      }),
    ],
    [createSocialLink, socialLinkIconStyle],
  );

  return {
    mainMenuItems,
    mainMenuSocialLinks,
  };
  // Todo: to generate on the server side
};
