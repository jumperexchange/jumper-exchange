import { LiFiWidget, WidgetConfig } from '@lifi/widget';
import { Box, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';

const LiFiWidgetDynamic = dynamic(
  () => import('@lifi/widget').then((module) => module.LiFiWidget) as any,
  {
    ssr: false,
    loading: () => (
      <Skeleton
        sx={{ borderRadius: '16px' }}
        variant="rectangular"
        width={379}
        height={768}
      />
    ),
  },
) as typeof LiFiWidget;

export default function SwapAndBridge() {
  const theme = useTheme();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const widgetConfig: WidgetConfig = useMemo(() => {
    return {
      // walletManagement: {
      //   signer: signer,
      //   connect: async () => {
      //     let promiseResolver
      //     const loginAwaiter = new Promise<void>((resolve) => (promiseResolver = resolve))

      //     setShowConnectModal({ show: true, promiseResolver })

      //     await loginAwaiter
      //     if (account.signer) {
      //       return account.signer!
      //     } else {
      //       throw Error('No signer object after login')
      //     }
      //   },
      //   disconnect: async () => {
      //     disconnect()
      //   },
      //   switchChain: async (reqChainId: number) => {
      //     await switchChain(reqChainId)
      //     if (account.signer) {
      //       return account.signer!
      //     } else {
      //       throw Error('No signer object after chain switch')
      //     }
      //   },
      //   addToken: async (token: Token, chainId: number) => {
      //     await switchChainAndAddToken(chainId, token)
      //   },
      //   addChain: async (chainId: number) => {
      //     return addChain(chainId)
      //   },
      // },

      containerStyle: {
        height: 'calc(100% - 160px)',
        border: `1px solid rgb(234, 234, 234)`,
        borderRadius: '16px',
        minWidth: 360,
        minHeight: 768,
        maxHeight: 800,
      },
      theme: {
        palette: {
          primary: {
            main: theme.palette.brandPrimary.dark,
          },
          secondary: {
            main: theme.palette.brandSecondary.main,
          },
          background: {
            default: theme.palette.background.default,
          },
        },
      },
    };
  }, [
    theme.palette.background.default,
    theme.palette.brandPrimary.dark,
    theme.palette.brandSecondary.main,
  ]);

  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box sx={{ m: 16 }}>
        <LiFiWidgetDynamic config={widgetConfig} />
      </Box>
    </Grid>
  );
}
