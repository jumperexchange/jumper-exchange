import { Route, Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import {
  HiddenUI,
  LiFiWidget,
  RouteExecutionUpdate,
  useWidgetEvents,
  WidgetConfig,
  WidgetEvent,
  WidgetVariant,
} from '@lifi/widget';
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactGA from 'react-ga';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../../providers/MenuProvider';
import { useWallet } from '../../providers/WalletProvider';
import { LinkMap } from '../../types/';
import { LanguageKey } from '../../types/i18n';
import { gaEventTrack } from '../../utils/google-analytics';
import { WidgetContainer } from './Widget.styled';

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
        boxShadow: !!isDarkMode
          ? '0px 8px 32px rgba(255, 255, 255, 0.08)'
          : '0px 8px 32px rgba(0, 0, 0, 0.08)',
      },
      languages: {
        default: i18n.language as LanguageKey,
        allow: ['de', 'en'],
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
          // secondary: {
          //   main: '#ffc36a', //brown //theme.palette.brandSecondary.main,
          // },
          // background: {
          //   default: '#eeeee4', //theme.palette.background.default,
          // },
        },
      },
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
  const [lastTxHash, setLastTxHas] = useState<string>();
  const handleIsActiveUrl = useCallback(
    (activeUrl: string) =>
      Object.values(LinkMap).filter((el) => {
        if (el.includes(activeUrl)) {
          let url = window.location.pathname.slice(1, 1 + activeUrl.length);
          ReactGA.send({ hitType: 'pageview', page: `/${url}` });
          return url === activeUrl;
        }
      }),
    [],
  );

  const starterVariant = useMemo(() => {
    if (handleIsActiveUrl('swap')) {
      return 'expandable';
    } else if (handleIsActiveUrl('gas') || handleIsActiveUrl('refuel')) {
      return 'refuel';
    }
  }, [window.location.pathname]);

  const getActiveWidget = () => {
    if (!starterVariantUsed) {
      starterVariant === 'expandable'
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

  const widgetEvents = useWidgetEvents();

  useEffect(() => {
    const onRouteExecutionStarted = async (route: Route) => {
      // console.log('onRouteExecutionStarted fired.', route);
      if (!!route?.id) {
        gaEventTrack({
          category: 'widgetEvent',
          action: 'onRouteExecutionStarted',
          label: `${route.id}`,
        });
      }
    };
    const onRouteExecutionUpdated = async (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionUpdated fired.', update);
      if (!!update?.process && !!update.route) {
        if (update.process.txHash !== lastTxHash) {
          // console.log({
          //   fromChainId: update.route.fromChainId,
          //   transactionHash: update.process.txHash,
          //   routeId: update.route.id,
          //   transactionLink: update.process.txLink,
          // });
          setLastTxHas(update.process.txHash);
          gaEventTrack({
            category: 'widgetEvent',
            action: 'onRouteExecutionUpdated',
            label: `${update?.process?.txHash}`,
          });
        }
      }
    };
    const onRouteExecutionCompleted = async (route: Route) => {
      // console.log('onRouteExecutionCompleted fired.', route);
      if (!!route?.id) {
        gaEventTrack({
          category: 'widgetEvent',
          action: 'onRouteExecutionCompleted',
          label: `${route.id}`,
        });
      }
    };
    const onRouteExecutionFailed = async (update: RouteExecutionUpdate) => {
      // console.log('onRouteExecutionFailed fired.', update);
      gaEventTrack({
        category: 'widgetEvent',
        action: 'onRouteExecutionFailed',
        label: `${update?.route?.id}`,
      });
    };

    widgetEvents.on(WidgetEvent.RouteExecutionStarted, onRouteExecutionStarted);
    widgetEvents.on(WidgetEvent.RouteExecutionUpdated, onRouteExecutionUpdated);
    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.RouteExecutionFailed, onRouteExecutionFailed);

    return () => widgetEvents.all.clear();
  }, [widgetEvents]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <WidgetContainer isActive={_starterVariant === 'expandable'}>
        <Widget starterVariant={'expandable'} />
      </WidgetContainer>
      <WidgetContainer isActive={_starterVariant === 'refuel'}>
        <Widget starterVariant={'refuel'} />
      </WidgetContainer>
    </Grid>
  );
}
