import { Token } from '@lifi/sdk';
import { Wallet } from '@lifi/wallet-management';
import { Signer } from 'ethers';

export interface WalletContextProps {
  account: WalletAccount;
  usedWallet?: Wallet;
  addChain(chainId: number): Promise<boolean>;
  addToken(chainId: number, token: Token): Promise<void>;
  disconnect(): void;
  switchChain(chainId: number): Promise<boolean>;
  connect(wallet?: Wallet | undefined): Promise<void>;
}

export interface WalletAccount {
  address?: string;
  isActive?: boolean;
  signer?: Signer;
  chainId?: number;
}
