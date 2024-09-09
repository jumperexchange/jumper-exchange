import type { WalletConnectParameters } from 'wagmi/connectors';

export const defaultWalletConnectConfig: WalletConnectParameters = {
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID,
};
