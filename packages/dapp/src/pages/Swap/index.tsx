import { Token } from '@lifi/sdk';
import {
  addChain,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { Box, Grid } from '@mui/material';
import { useLocales } from '@transferto/shared/src/hooks/use-locales';
import { DappLanguageSupported } from '@transferto/shared/types';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useWallet } from '../../providers/WalletProvider';

export default function Swap() {
  const { disconnect, account } = useWallet();
  const { translate } = useLocales();
  const { i18n } = useTranslation();
  const i18Path = 'Navbar.Swap';
  const translateText = translate(i18Path);

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      walletManagement: {
        signer: account.signer,
        connect: async () => {
          let promiseResolver;
          const loginAwaiter = new Promise<void>(
            (resolve) => (promiseResolver = resolve),
          );

          // setShowConnectModal({ show: true, promiseResolver });

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
        border: `1px solid rgb(234, 234, 234)`,
        borderRadius: '16px',
        maxHeight: '770px',
      },
      languages: {
        default: i18n.language as DappLanguageSupported,
        allow: ['de', 'en'],
      },
      // theme: {
      //   palette: {
      //     primary: {
      //       main: theme.palette.brandPrimary.dark,
      //     },
      //     secondary: {
      //       main: theme.palette.brandSecondary.main,
      //     },
      //     background: {
      //       default: theme.palette.background.default,
      //     },
      //   },
      // },
    };
  }, [i18n.language]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{ m: 8 }}>
        <LiFiWidget config={widgetConfig} />
      </Box>
    </Grid>
  );
}
