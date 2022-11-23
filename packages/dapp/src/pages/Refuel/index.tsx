import { Token } from '@lifi/sdk';
import {
  addChain,
  supportedWallets,
  switchChain,
  switchChainAndAddToken,
} from '@lifi/wallet-management';
import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { Box, Grid } from '@mui/material';
import { WalletModal } from '@transferto/shared/src/molecules';
import { DappLanguagesSupported } from '@transferto/shared/types';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWallet } from '../../providers/WalletProvider';

// TODO: pull interface into types
interface ShowConnectModalProps {
  show: boolean;
  promiseResolver?: Promise<any>;
}

export default function Refuel() {
  const { disconnect, account } = useWallet();
  const { i18n } = useTranslation();
  const [showConnectModal, setShowConnectModal] =
    useState<ShowConnectModalProps>({ show: false });

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      variant: 'refuel',
      walletManagement: {
        signer: account.signer,
        connect: async () => {
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
        border: `1px solid rgb(234, 234, 234)`,
        borderRadius: '16px',
        maxHeight: '770px',
      },
      languages: {
        default: i18n.language as DappLanguagesSupported,
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
  }, [i18n.language, account.signer]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{ m: '64px auto' }}>
        <LiFiWidget config={widgetConfig} />
      </Box>
      <WalletModal
        open={showConnectModal.show}
        handleClose={() => setShowConnectModal({ show: false })}
        setOpen={() => setShowConnectModal({ show: true })}
        wallets={supportedWallets}
        walletManagement={useWallet()}
      />
    </Grid>
  );
}
