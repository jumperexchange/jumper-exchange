import { TableColumnType } from 'antd';

export interface Amounts {
  amount_coin: number;
  amount_usd: number;
}

export interface Coin {
  key: string;
  name: string;
  img_url: string;
  contracts: {
    [ChainKey: string]: string,
  }
}



export interface DataType  {
  [key: string]: string | number | Amounts | Coin; // kind of deactivating typing for DataType; last resort?
  key: React.Key; //React.key
  coin: Coin; 
  portfolio: Amounts; //Amounts
}

export enum ChainKey {
  ETH = 'eth',
  POL = 'matic',
  BSC = 'bsc',
  DAI = 'xdai',
  OKT = 'okt',
  FTM = 'ftm'
}



export interface ColomnType extends TableColumnType<DataType> {
  children?: Array<ColomnType>;
}


export interface ChainPortfolio{
  id: string,
  pricePerCoin: number,
  amount: number,
}


export interface Wallet {
  address: string;
  loading: boolean;
  portfolio: {[ChainKey: string]: Array<ChainPortfolio>} // ChainKeys -> [ChainPortfolio]
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
  OKT = 'OKT'
}

export enum Currencies {
  USD = "usd",
  EUR = "eur",
}

export interface SummaryAmounts {
  amount_usd: number;
  percentage_of_portfolio: number;
}

export interface WalletSummary{
  wallet: string
  [ChainKey.ETH]: SummaryAmounts;
  [ChainKey.POL]: SummaryAmounts;
  [ChainKey.BSC]: SummaryAmounts;
  [ChainKey.DAI]: SummaryAmounts;
  [ChainKey.OKT]: SummaryAmounts;
  [ChainKey.FTM]: SummaryAmounts;
}

export interface ProgressStep {
  title: string
  description: string
}


