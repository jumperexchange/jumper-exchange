import { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import {
  HiddenUI,
  LiFiWidget,
  WidgetConfig,
  WidgetVariant,
} from '@lifi/widget';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { hotjar } from 'react-hotjar';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../../providers/MenuProvider';
import { useWallet } from '../../providers/WalletProvider';
import { LinkMap } from '../../types/';
import { LanguageKey } from '../../types/i18n';
import { gaEventTrack } from '../../utils/google-analytics';
import { WidgetContainer } from './Widget.styled';
import { WidgetEvents } from './WidgetEvents';

interface ShowConnectModalProps {
  show: boolean;
  promiseResolver?: Promise<any>;
}

function widgetConfigComponent({ starterVariant }) {
  const menu = useMenu();
  const theme = useTheme();
  const { disconnect, account } = useWallet();
  const { i18n } = useTranslation();
  const isDarkMode = theme.palette.mode === 'dark';

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      variant: starterVariant,
      walletManagement: {
        signer: account.signer,
        connect: async () => {
          menu.onOpenNavbarWalletMenu(
            !!menu.openNavbarWalletMenu ? false : true,
          );
          let promiseResolver;
          const loginAwaiter = new Promise<void>(
            (resolve) => (promiseResolver = resolve),
          );

          await loginAwaiter;
          if (account.signer) {
            ReactGA.set({
              username: account.address,
              chainId: account.chainId,
              // Other relevant user information
            });
            hotjar.initialized() &&
              hotjar.identify('USER_ID', {
                address: account.address,
                chainId: account.chainId,
              });
            gaEventTrack({
              category: 'walletInteraction',
              action: 'connect',
              label: account.address, // optional
              value: account.chainId, // optional, must be a number
              nonInteraction: false, // optional, true/false
              // transport: "xhr", // optional, beacon/xhr/image
            });
            return account.signer!;
          } else {
            throw Error('No signer object after login');
          }
        },
        disconnect: async () => {
          gaEventTrack({
            category: 'walletInteraction',
            action: 'disconnect',
            label: account?.address, // optional
            value: account?.chainId, // optional, must be a number
            nonInteraction: false, // optional, true/false
            // transport: "xhr", // optional, beacon/xhr/image
          });
          disconnect();
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId);
          if (account.signer) {
            gaEventTrack({
              category: 'walletInteraction',
              action: 'switchChain',
              label: account.address, // optional
              value: reqChainId, // optional, must be a number
              nonInteraction: false, // optional, true/false
              // transport: "xhr", // optional, beacon/xhr/image
            });
            return account.signer!;
          } else {
            throw Error('No signer object after chain switch');
          }
        },
        addToken: async (token: Token, chainId: number) => {
          gaEventTrack({
            category: 'walletInteraction',
            action: 'addToken',
            label: account?.address, // optional
            value: chainId, // optional, must be a number
            nonInteraction: false, // optional, true/false
            // transport: "xhr", // optional, beacon/xhr/image
          });
          await switchChainAndAddToken(chainId, token);
        },
        addChain: async (chainId: number) => {
          return addChain(chainId);
        },
      },
      containerStyle: {
        borderRadius: '12px',
        boxShadow: !isDarkMode
          ? '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.08)'
          : '0px 2px 4px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.16)',
      },
      languages: {
        default: i18n.language as LanguageKey,
        allow: i18n.languages as LanguageKey[],
      },
      appearance: !!isDarkMode ? 'dark' : 'light',
      hiddenUI: [HiddenUI.Appearance, HiddenUI.Language, HiddenUI.PoweredBy],
      theme: {
        shape: {
          borderRadius: 12,
          borderRadiusSecondary: 24,
        },
        palette: {
          background: {
            paper: theme.palette.surface2.main,
            default: theme.palette.surface1.main,
          },
          primary: {
            main: theme.palette.accent1.main,
          },
          grey: {
            300: theme.palette.grey[300],
            800: theme.palette.grey[800]
          }
          // secondary: {
          //   main: '#ffc36a', //brown //theme.palette.brandSecondary.main,
          // },
          // background: {
          //   default: '#eeeee4', //theme.palette.background.default,
          // },
        },
      },
      localStorageKeyPrefix: `jumper-${starterVariant}`,
    };
  }, [
    i18n.language,
    isDarkMode,
    account.signer,
    disconnect,
    theme.palette.mode,
  ]);

  return widgetConfig;
}

export function Widget({ starterVariant }) {
  const widgetConfig = widgetConfigComponent(
    (starterVariant = { starterVariant }),
  );
  return <LiFiWidget config={widgetConfig} />;
}

export function DualWidget() {
  const settings = useSettings();
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] =
    useState<WidgetVariant>('expandable');
  // const handleIsActiveUrl = useCallback(
  //   (activeUrl: string) =>
  //     {}
  //   [],
  // );

  const starterVariant = useMemo(() => {
    const activeUrl = Object.values(LinkMap).filter((el) =>
      window.location.pathname.includes(el),
    );
    if (activeUrl.length) {
      let url = window.location.pathname.slice(1, 1 + activeUrl[0].length);
      ReactGA.send({ hitType: 'pageview', page: `/${url}` });
    }

    switch (activeUrl[0]) {
      case 'gas':
      case 'refuel':
        return 'refuel';
      default:
        return 'expandable';
    }
  }, [window.location.pathname]);

  const getActiveWidget = () => {
    if (!starterVariantUsed) {
      starterVariant.includes('expandable')
        ? settings.onChangeTab(0)
        : settings.onChangeTab(1);
      setStarterVariant(starterVariant);
      setStarterVariantUsed(true);
    } else {
      if (settings.activeTab === 0) {
        setStarterVariant('expandable');
      } else if (settings.activeTab === 1) {
        setStarterVariant('refuel');
      }
    }
  };

  useEffect(() => {
    getActiveWidget();
  }, [starterVariant]);

  useEffect(() => {
    getActiveWidget();
  }, [settings.activeTab]);

  return (
    <Grid justifyContent="center" alignItems="center" container>
      <WidgetContainer isActive={_starterVariant === 'expandable'}>
        <Widget starterVariant={'expandable'} />
      </WidgetContainer>
      <WidgetContainer isActive={_starterVariant === 'refuel'}>
        <Widget starterVariant={'refuel'} />
      </WidgetContainer>
      <WidgetEvents />
    </Grid>
  );
}
