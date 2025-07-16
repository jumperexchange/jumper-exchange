import { useMemo, useCallback } from 'react';
import { Discord } from '@/components/illustrations/Discord';
import { Telegram } from '@/components/illustrations/Telegram';
import { X } from '@/components/illustrations/X';
import { Link3Icon } from '@/components/illustrations/Link3Icon';
import { MenuKeysEnum } from '@/const/menuKeys';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import {
  AppPaths,
  DISCORD_URL,
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
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useThemeModesMenuContent } from '../ThemeModesSubMenu/useThemeModesMenuContent';
import { MenuItemProps } from 'src/components/Menu/MenuItem/MenuItem.types';
import Typography from '@mui/material/Typography';

interface MenuLink {
  url: string;
  external?: boolean;
}

interface MenuItem extends Omit<MenuItemProps, 'open'> {}

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

interface TrackPageloadParams {
  destination: string;
  url: string;
  source?: TrackingCategory;
}

interface TrackMenuClickParams {
  label: string;
  action: TrackingAction;
  dataMenuParam: string;
}

export const useMenuTracking = () => {
  const { trackEvent } = useUserTracking();

  const trackPageLoad = useCallback(
    ({
      destination,
      url,
      source = TrackingCategory.Menu,
    }: TrackPageloadParams) => {
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
    ({ label, action, dataMenuParam }: TrackMenuClickParams) => {
      trackEvent({
        category: TrackingCategory.Menu,
        label,
        action,
        data: { [TrackingEventParameter.Menu]: dataMenuParam },
      });
    },
    [trackEvent],
  );

  return { trackPageLoad, trackMenuClick };
};

export const useMenuActions = () => {
  const { trackEvent } = useUserTracking();
  const { trackMenuClick } = useMenuTracking();
  const { setSupportModalState, setSubMenuState, closeAllMenus } = useMenuStore(
    (state) => state,
  );

  const handleExchangeClick = useCallback(() => {
    trackMenuClick({
      label: 'click-jumper-exchange-link',
      action: TrackingAction.ClickJumperExchangeLink,
      dataMenuParam: 'jumper_exchange',
    });
    closeAllMenus();
  }, [trackMenuClick, closeAllMenus]);

  const handleMissionsClick = useCallback(() => {
    trackMenuClick({
      label: 'click-jumper-missions-link',
      action: TrackingAction.ClickJumperMissionsLink,
      dataMenuParam: 'jumper_missions',
    });
    closeAllMenus();
  }, [trackMenuClick, closeAllMenus]);

  const handleProfileClick = useCallback(() => {
    trackMenuClick({
      label: 'click-jumper-profile-link',
      action: TrackingAction.ClickJumperProfileLink,
      dataMenuParam: 'jumper_profile',
    });
    closeAllMenus();
  }, [trackMenuClick, closeAllMenus]);

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

  return {
    handleExchangeClick,
    handleMissionsClick,
    handleProfileClick,
    handleLearnClick,
    handleScanClick,
    handleSupportClick,
    handleThemeClick,
    handleLanguageClick,
    handleResourcesClick,
  };
};

export const useSocialLinks = () => {
  const theme = useTheme();
  const { trackMenuClick, trackPageLoad } = useMenuTracking();

  const socialLinkIconStyle = useMemo(
    () => ({
      color: (theme.vars || theme).palette.alphaLight600.main,
      ...theme.applyStyles('light', {
        color: (theme.vars || theme).palette.alphaDark500.main,
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

  const socialLinks: SocialLink[] = useMemo(
    () => [
      createSocialLink({
        label: SocialLinkLabel.X,
        icon: <X sx={socialLinkIconStyle} />,
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

  return { socialLinks };
};

export const useMenuItems = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [configTheme] = useThemeStore((state) => [state.configTheme]);
  const { selectedThemeIcon } = useThemeModesMenuContent();

  const {
    handleLearnClick,
    handleScanClick,
    handleSupportClick,
    handleThemeClick,
    handleLanguageClick,
    handleResourcesClick,
  } = useMenuActions();

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

  const baseMenuItems: MenuItem[] = useMemo(() => {
    const baseItems: MenuItem[] = [];

    baseItems.push(
      {
        label: t('navbar.navbarMenu.learn'),
        prefixIcon: <SchoolIcon />,
        showMoreIcon: false,
        link: { url: AppPaths.Learn },
        onClick: handleLearnClick,
      },
      {
        label: t('navbar.navbarMenu.scan'),
        prefixIcon: <SearchOutlinedIcon />,
        showMoreIcon: false,
        link: { url: AppPaths.Scan, external: false },
        onClick: handleScanClick,
      },
      {
        label: t('navbar.navbarMenu.support'),
        prefixIcon: discordSupportIcon,
        showMoreIcon: false,
        onClick: handleSupportClick,
      },
    );

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
      {
        isDivider: true,
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

  return { menuItems: baseMenuItems };
};

export const useMainMenuContent = () => {
  const { menuItems } = useMenuItems();
  const { socialLinks } = useSocialLinks();

  return {
    mainMenuItems: menuItems,
    mainMenuSocialLinks: socialLinks,
  };
  // Todo: to generate on the server side
};
