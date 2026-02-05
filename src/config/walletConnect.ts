import { pageMetadataFields } from '@/app/lib/metadata';
import type { WalletConnectParameters } from 'wagmi/connectors';
import config from '@/config/env-config';
import { JUMPER_URL } from '@/const/urls';

export const defaultWalletConnectConfig: WalletConnectParameters = {
  projectId: config.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  metadata: {
    name: pageMetadataFields.default.title,
    description: pageMetadataFields.default.description,
    url: JUMPER_URL,
    icons: [`${JUMPER_URL}/logo-144x144.svg`],
  },
  qrModalOptions: {
    themeVariables: {
      '--wcm-z-index': '3000',
    },
  },
};
