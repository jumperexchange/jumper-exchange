import type { WalletConnectParameters } from 'wagmi/connectors';

export const defaultWalletConnectConfig: WalletConnectParameters = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  // metadata: {

  // }
  qrModalOptions: {
    enableExplorer: false,
    themeVariables: {
      '--wcm-z-index': '3000',
    },
  },
};
