import { Tabs } from '@/components/Tabs/Tabs';
import { Discord } from '@/components/illustrations/Discord';
import { MenuKeysEnum } from '@/const/menuKeys';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import {
  DISCORD_URL,
  JUMPER_BOYCO_PATH,
  JUMPER_LEARN_PATH,
  JUMPER_LOYALTY_PATH,
  JUMPER_SCAN_PATH,
  X_URL,
} from '@/const/urls';
import { useUserTracking } from '@/hooks/userTracking/useUserTracking';
import { useMenuStore } from '@/stores/menu';
import { useThemeStore } from '@/stores/theme';
import { getContrastAlphaColor } from '@/utils/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import LanguageIcon from '@mui/icons-material/Language';
import SchoolIcon from '@mui/icons-material/School';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import XIcon from '@mui/icons-material/X';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useThemeSwitchTabs } from './useThemeSwitchTabs';

export const useMainMenuContent = () => {
  const { t, i18n } = useTranslation();
  const { trackEvent } = useUserTracking();
  const router = useRouter();
  const theme = useTheme();
  const pathname = usePathname();
  const [themeMode, configTheme] = useThemeStore((state) => [
    state.themeMode,
    state.configTheme,
  ]);
  const { setSupportModalState, setSubMenuState, closeAllMenus } = useMenuStore(
    (state) => state,
  );

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

  let mainMenu: any[] = [];

  if (configTheme?.hasThemeModeSwitch) {
    mainMenu.push({
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
    });
  }

  mainMenu = mainMenu.concat([
    {
      label: t('language.key', { ns: 'language' }),
      prefixIcon: <LanguageIcon />,
      suffixIcon: (
        <Typography
          variant="bodyMedium"
          textTransform={'uppercase'}
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 38,
          }}
        >
          {i18n.language}
        </Typography>
      ),
      showMoreIcon: true,
      triggerSubMenu: MenuKeysEnum.Language,
      onClick: () => {
        setSubMenuState(MenuKeysEnum.Language);
      },
    },
    {
      label: t('navbar.navbarMenu.developers'),
      prefixIcon: <DeveloperModeIcon />,
      triggerSubMenu: MenuKeysEnum.Devs,
      onClick: () => {
        setSubMenuState(MenuKeysEnum.Devs);
        trackEvent({
          category: TrackingCategory.MainMenu,
          action: TrackingAction.OpenMenu,
          label: `open_submenu_${MenuKeysEnum.Devs.toLowerCase()}`,
          data: { [TrackingEventParameter.Menu]: MenuKeysEnum.Devs },
        });
      },
    },
    {
      label: 'Jumper Profile',
      prefixIcon: <AccountCircleIcon />,
      showMoreIcon: false,
      link: { url: JUMPER_LOYALTY_PATH },
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-jumper-pass-link',
          action: TrackingAction.ClickJumperProfileLink,
          data: { [TrackingEventParameter.Menu]: 'pass' },
        });
        closeAllMenus();
        router.push(JUMPER_LOYALTY_PATH);
      },
    },
    {
      label: 'Jumper Learn',
      prefixIcon: <SchoolIcon />,
      showMoreIcon: false,
      link: { url: JUMPER_LEARN_PATH },
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-jumper-learn-link',
          action: TrackingAction.ClickJumperLearnLink,
          data: { [TrackingEventParameter.Menu]: 'jumper_learn' },
        });
        closeAllMenus();
        router.push(JUMPER_LEARN_PATH);
      },
    },
    {
      label: 'Jumper Scan',
      prefixIcon: <SearchOutlinedIcon />,
      showMoreIcon: false,
      link: { url: JUMPER_SCAN_PATH, external: false },
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'open-jumper-scan',
          action: TrackingAction.ClickJumperScanLink,
          data: { [TrackingEventParameter.Menu]: 'jumper_scan' },
        });
      },
    },
    {
      label: 'X',
      prefixIcon: <XIcon />,
      showMoreIcon: false,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-x-link',
          action: TrackingAction.ClickXLink,
          data: { [TrackingEventParameter.Menu]: 'x-jumper' },
        });
        trackEvent({
          category: TrackingCategory.Pageload,
          action: TrackingAction.PageLoad,
          label: 'pageload-x_jumper',
          data: {
            [TrackingEventParameter.PageloadSource]: TrackingCategory.Menu,
            [TrackingEventParameter.PageloadDestination]: 'x-jumper',
            [TrackingEventParameter.PageloadURL]: X_URL,
            [TrackingEventParameter.PageloadExternal]: true,
          },
        });
      },
      link: { url: X_URL, external: true },
    },
    {
      label: 'Discord',
      prefixIcon: <Discord color={theme.palette.text.primary} />,
      showMoreIcon: false,
      onClick: () => {
        trackEvent({
          category: TrackingCategory.Menu,
          label: 'click-discord-link',
          action: TrackingAction.ClickDiscordLink,
          data: { [TrackingEventParameter.Menu]: 'jumper_discord' },
        });
        trackEvent({
          category: TrackingCategory.Pageload,
          action: TrackingAction.PageLoad,
          label: 'pageload-discord',
          data: {
            [TrackingEventParameter.PageloadSource]: TrackingCategory.MainMenu,
            [TrackingEventParameter.PageloadDestination]: 'jumper_discord',
            [TrackingEventParameter.PageloadURL]: DISCORD_URL,
            [TrackingEventParameter.PageloadExternal]: true,
          },
        });
      },
      link: { url: DISCORD_URL, external: true },
    },
    {
      label: t('navbar.navbarMenu.support'),
      prefixIcon: (
        <Discord
          color={
            theme.palette.mode === 'light'
              ? theme.palette.primary.main
              : theme.palette.white.main
          }
        />
      ),
      onClick: () => {
        setSupportModalState(true);
      },
      showButton: true,
    },
  ]);

  return mainMenu;
  //Todo: to generate on the server side
};
