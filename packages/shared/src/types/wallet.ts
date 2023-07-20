import type { Token } from '@lifi/types';
import type { Signer } from '@ethersproject/abstract-signer';
import type events from 'events';

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

export interface Wallet extends events.EventEmitter {
  name: string;
  icon: string;
  isActivationInProgress: boolean;
  account?: WalletAccount;
  installed: () => Promise<boolean>;
  connect: () => Promise<void>;
  autoConnect?: () => Promise<void>;
  disconnect: () => void;
  switchChain: (chainId: number) => Promise<boolean>;
  addChain: (chainId: number) => Promise<boolean>;
  addToken: (chainId: number, token: Token) => Promise<boolean>;
}
