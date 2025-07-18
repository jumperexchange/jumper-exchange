import { WalletConnected } from '@lifi/wallet-management';
import { EVMAddress } from 'src/types/internal';

export interface WalletState {
  account?: WalletConnected;
  verified?: boolean;
  signed?: boolean;
  signature?: EVMAddress;
  message?: string;
}
