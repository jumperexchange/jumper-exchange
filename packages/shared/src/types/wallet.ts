import type { Signer } from '@ethersproject/abstract-signer';
import type { Token } from '@lifi/types';
import type { ChainId } from '@lifi/types';
import type events from 'events';

export interface WalletContextProps {
  account: WalletAccount;
  usedWallet?: Wallet;
  addChain(chainId: ChainId): Promise<boolean>;
  addToken(chainId: ChainId, token: Token): Promise<void>;
  disconnect(): void;
  switchChain(chainId: ChainId): Promise<any>;
  connect(wallet?: Wallet | undefined): Promise<void>;
}

export interface WalletAccount {
  address?: string;
  isActive?: boolean;
  signer?: Signer;
  chainId?: ChainId;
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
  switchChain: (chainId: ChainId) => Promise<boolean>;
  addChain: (chainId: ChainId) => Promise<boolean>;
  addToken: (chainId: ChainId, token: Token) => Promise<boolean>;
}
