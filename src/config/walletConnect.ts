import type { WalletConnectParameters } from 'wagmi/connectors';
import { siteName, description } from '@/app/lib/metadata';

export const defaultWalletConnectConfig: WalletConnectParameters = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: siteName,
    description,
    url: 'https://jumper.exchange',
    icons: ['https://jumper.exchange/logo-144x144.svg'],
  },
  qrModalOptions: {
    themeVariables: {
      '--wcm-z-index': '3000',
    },
  },
};
