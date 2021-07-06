import { TableColumnType } from 'antd';

export interface Amounts {
  amount_coin: number;
  amount_usd: number;
}

export interface Token {
  id: string
  symbol: string
  decimals: number
  chainId: number
  name: string
  logoURI: string

  chainKey: ChainKey
  key: CoinKey
}

export interface Coin {
  key: CoinKey;
  name: string;
  logoURI: string;
  chains: {
    [ChainKey: string]: Token,
  }
}

export interface DataType {
  [key: string]: string | number | Amounts | Coin; // kind of deactivating typing for DataType; last resort?
  key: React.Key;
  coin: Coin;
  portfolio: Amounts;
}

export enum ChainKey {
  ETH = 'eth',
  POL = 'matic',
  BSC = 'bsc',
  DAI = 'xdai',
  OKT = 'okt',
  FTM = 'ftm',
  AVA = 'ava',
}

export interface ColomnType extends TableColumnType<DataType> {
  children?: Array<ColomnType>;
}

export interface ChainPortfolio {
  id: string,
  name: string,
  symbol: string,
  img_url: string,
  pricePerCoin: number,
  amount: number,
}

export interface Wallet {
  address: string;
  loading: boolean;
  portfolio: { [ChainKey: string]: Array<ChainPortfolio> } // ChainKeys -> [ChainPortfolio]
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
  AAVE = 'AAVE',
  FTM = 'FTM',
  OKT = 'OKT',
  AVAX = 'AVAX',
}

export enum Currencies {
  USD = "usd",
  EUR = "eur",
}

export interface SummaryAmounts {
  amount_usd: number;
  percentage_of_portfolio: number;
}

export interface WalletSummary {
  wallet: string
  [ChainKey.ETH]: SummaryAmounts;
  [ChainKey.POL]: SummaryAmounts;
  [ChainKey.BSC]: SummaryAmounts;
  [ChainKey.DAI]: SummaryAmounts;
  [ChainKey.OKT]: SummaryAmounts;
  [ChainKey.FTM]: SummaryAmounts;
  [ChainKey.AVA]: SummaryAmounts;
}

export interface ProgressStep {
  title: string
  description: string
}
