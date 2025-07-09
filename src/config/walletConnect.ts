import { description, siteName } from '@/app/lib/metadata';
import type { WalletConnectParameters } from 'wagmi/connectors';
import config from '@/config/env-config';

export const defaultWalletConnectConfig: WalletConnectParameters = {
  projectId: config.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
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
