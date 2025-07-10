import { WalletConnected } from '@lifi/wallet-management';

export interface WalletState {
  account?: WalletConnected;
  verified?: boolean;
  signed?: boolean;
  signature?: `0x${string}`;
  message?: string;
}
