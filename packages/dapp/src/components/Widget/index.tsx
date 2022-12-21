import { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import { useSearchParams } from 'react-router-dom';

import {
  HiddenUI,
  LiFiWidget,
  WidgetConfig,
  WidgetVariant,
} from '@lifi/widget';
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSettings } from '@transferto/shared/src/hooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../../providers/MenuProvider';
import { useWallet } from '../../providers/WalletProvider';
import { LanguageKey } from '../../types/i18n';

interface ShowConnectModalProps {
  show: boolean;
  promiseResolver?: Promise<any>;
}
export default function Widget({ starterVariant }) {
  const theme = useTheme();
  const settings = useSettings();
  const menu = useMenu();
  const { disconnect, account } = useWallet();
  const { i18n } = useTranslation();
  const isDarkMode = theme.palette.mode === 'dark';
  const [starterVariantUsed, setStarterVariantUsed] = useState(false);
  const [_starterVariant, setStarterVariant] =
    useState<WidgetVariant>('expandable');
  const [showConnectModal, setShowConnectModal] =
    useState<ShowConnectModalProps>({ show: false });
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [searchParamsByRouter, setSearchParamsByRouter] = useSearchParams();

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
    return _starterVariant;
  };

  useEffect(() => {
    getActiveWidget();
  }, []);

  useEffect(() => {
    getActiveWidget();
  }, [settings.activeTab]);

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      variant: _starterVariant,
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

          setShowConnectModal({ show: true, promiseResolver });

          await loginAwaiter;
          if (account.signer) {
            return account.signer!;
          } else {
            throw Error('No signer object after login');
          }
        },
        disconnect: async () => {
          disconnect();
        },
        switchChain: async (reqChainId: number) => {
          await switchChain(reqChainId);
          if (account.signer) {
            return account.signer!;
          } else {
            throw Error('No signer object after chain switch');
          }
        },
        addToken: async (token: Token, chainId: number) => {
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
          borderRadius: '12px',
          borderRadiusSecondary: '24px',
        },
        palette: {
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
    _starterVariant,
    theme.palette.mode,
  ]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box
        sx={{
          marginTop: theme.spacing(8),
          // make widget scrollable on screens smaller than:
          // 80px (navbar height)
          // + 32px (margin-top of widget)
          // + 680px (height of widget)
          [`@media (max-height: ${80 + 32 + 680}px)`]: {
            overflowY: 'auto',
            height: 'calc( 100vh - 80px - 32px)',
            marginTop: '18px',
          },
          '> div': {
            marginTop: '32px',
          },
        }}
      >
        <LiFiWidget config={widgetConfig} />
      </Box>
    </Grid>
  );
}
