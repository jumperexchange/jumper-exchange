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

export interface TokenWithAmounts extends Token {
  amount?: number
  amountRendered?: string
}

export interface Coin {
  key: CoinKey;
  name: string;
  logoURI: string;
  verified: boolean;
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
  POL = 'pol',
  BSC = 'bsc',
  DAI = 'dai',
  OKT = 'okt',
  FTM = 'ftm',
  AVA = 'ava',
  ARB = 'arb',
  HEC = 'hec',
  OPT = 'opt',

  // Testnets
  ROP = 'rop',
  RIN = 'rin',
  GOR = 'gor',
  MUM = 'mum',
  ARBT = 'arbt',
  OPTT = 'optt',
  BSCT = 'bsct',
  HECT = 'hect'
}

export function chainKeysToObject(val: any) {
  const result : { [ChainKey: string]: any } = {}
  for (const key in ChainKey) {
    result[key.toLowerCase()] = JSON.parse(JSON.stringify(val))
  }
  return result
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
  verified: boolean,
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

  // Testnet
  TEST = 'TEST',
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
  [ChainKey.HEC]: SummaryAmounts;
  [ChainKey.OPT]: SummaryAmounts;
  [ChainKey.ARB]: SummaryAmounts;

  [ChainKey.ROP]: SummaryAmounts;
  [ChainKey.RIN]: SummaryAmounts;
  [ChainKey.GOR]: SummaryAmounts;
  [ChainKey.MUM]: SummaryAmounts;
  [ChainKey.ARBT]: SummaryAmounts;
  [ChainKey.OPTT]: SummaryAmounts;
  [ChainKey.BSCT]: SummaryAmounts;
  [ChainKey.HECT]: SummaryAmounts;
}

export interface ProgressStep {
  title: string
  description: string
}
