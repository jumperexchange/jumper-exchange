import {
  ChainKey,
  Coin,
  Token,
  TokenAmount,
  TokenWithAmounts,
} from '@lifi/sdk';
import { Wallet as WalletManagementWallet } from '@lifi/wallet-management';
import BigNumber from 'bignumber.js';
import { Signer } from 'ethers';

export interface TokenAmountList {
  [ChainKey: string]: Array<TokenWithAmounts>;
}

export interface ShowConnectModalProps {
  show: boolean;
  promiseResolver?: Promise<any>;
}

export interface MenuItem {
  label: string;
  destination: string;
}

export interface MenuListItem {
  label: string;
  triggerSubMenu?: string;
  prefixIcon?: JSX.Element | string;
  suffixIcon?: JSX.Element | string;
  showMoreIcon?: boolean;
  checkIcon?: boolean;
  url?: string;
  onClick?: any; //(mode?: string) => void;
  showButton?: boolean;
}

export type TWallet = {
  name: string;
  icon: string;
};
export type TWallets = {
  [key: string]: TWallet;
};

export interface SwapPageStartParams {
  depositChain?: ChainKey;
  depositToken?: string;
  depositAmount: BigNumber;
  withdrawChain?: ChainKey;
  withdrawToken?: string;
}

export interface Amounts {
  amount_coin: BigNumber;
  amount_usd: BigNumber;
}

export interface DataType {
  [key: string]: string | number | Amounts | Coin; // kind of deactivating typing for DataType; last resort?
  key: React.Key;
  coin: Coin;
  portfolio: Amounts;
}

export function chainKeysToObject(val: any) {
  const result: { [ChainKey: string]: any } = {};
  for (const key in ChainKey) {
    result[key.toLowerCase()] = JSON.parse(JSON.stringify(val));
  }
  return result;
}

export interface Wallet {
  address: string;
  loading: boolean;
  portfolio: { [ChainKey: string]: Array<TokenAmount> };
}

export enum Currencies {
  USD = 'usd',
  EUR = 'eur',
}

export interface SummaryAmounts {
  amount_usd: BigNumber;
  percentage_of_portfolio: BigNumber;
}

export interface WalletSummary {
  wallet: string;
  chains: {
    [ChainKey: string]: SummaryAmounts;
  };
}

export interface WalletConnectInfo {
  accounts: string[];
  bridge: string;
  chainId: number;
  clientId: string;
  clientMeta: { [k: string]: any }; // not important as of now
  connected: boolean;
  handshakeId: number;
  handshakeTopic: string;
  key: string;
  peerId: string;
  peerMeta: { [k: string]: any }; // not important as of now
}

export interface WalletContextProps {
  account: WalletAccount;
  addChain(chainId: number): Promise<boolean>;
  addToken(chainId: number, token: Token): Promise<void>;
  disconnect(): void;
  switchChain(chainId: number): Promise<boolean>;
  connect(wallet?: WalletManagementWallet | undefined): Promise<void>;
}

export interface WalletAccount {
  address?: string;
  isActive?: boolean;
  signer?: Signer;
  chainId?: number;
}
