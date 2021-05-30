import { TableColumnType } from 'antd';

export interface Amounts {
  amount_coin: number;
  amount_usd: number;
}

export interface WalletAmounts {
  eth: Amounts;
  pol: Amounts;
  bsc: Amounts;
  dai: Amounts;
}

export interface Coin {
  key: string;
  name: string;
  img_url: string;
}

export enum WalletKey {
  WALLET1 = 'wallet1',
  WALLET2 = 'wallet2',
  WALLET3 = 'wallet3',
  WALLET4 = 'wallet4',
}

export interface DataType {
  key: React.Key;
  coin: Coin;
  portfolio: Amounts;

  [WalletKey.WALLET1]: WalletAmounts;
  [WalletKey.WALLET2]: WalletAmounts;
  [WalletKey.WALLET3]: WalletAmounts;
  [WalletKey.WALLET4]: WalletAmounts;
}

export enum ChainKey {
  ETH = 'eth',
  POL = 'pol',
  BSC = 'bsc',
  DAI = 'dai',
}

export interface ColomnType extends TableColumnType<DataType> {
  children?: Array<ColomnType>;
}

export interface Summary {
  portfolio: {
    amount_usd: number;
    percentage_of_portfolio: number;
  },
  [WalletKey.WALLET1]: any;
  [WalletKey.WALLET2]: any;
  [WalletKey.WALLET3]: any;
  [WalletKey.WALLET4]: any;
}
export interface Wallet {
  key: WalletKey;
  name: string;
  address: string;
  chains: Array<ChainKey>;
  loading: boolean;
}

export enum CoinKey {
  ETH = 'ETH',
  MATIC = 'MATIC',
  BNB = 'BNB',
  DAI = 'DAI',
  USDT = 'USDT',
  USDC = 'USDC',
  UNI = 'UNI',
  LINK = 'LINK',
  AAVE = 'AAVE'
}

export enum Currencies {
  USD = "usd",
  EUR = "eur",
}
