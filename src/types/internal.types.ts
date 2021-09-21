
import { TableColumnType } from 'antd';
import { Action, ChainKey, Coin, Estimate, Execution, Token } from '.';
import bsc from '../assets/icons/bsc.png';
import eth from '../assets/icons/ethereum.png';
import pancake from '../assets/icons/pancake.png';
import pol from '../assets/icons/polygon.png';
import quick from '../assets/icons/quick.png';
import honey from '../assets/icons/honey.png';
import dai from '../assets/icons/xdai.png';
import uniswap from '../assets/icons/uniswap.png';
import ftm from '../assets/icons/fantom.png';
import arb from '../assets/icons/arbitrum.svg';

export const icons: { [key: string]: string } = {
  bsc,
  eth,
  pol,
  dai,
  ftm,
  arb,

  'Pancake': pancake,
  'QuickSwap': quick,
  'Honeyswap': honey,
  'UniswapV2': uniswap,
}
export const getIcon = (name: string | undefined) => {
  if (name && icons[name]) {
    return icons[name]
  }
  return ''
}

export interface Amounts {
  amount_coin: number;
  amount_usd: number;
}

export interface TokenWithAmounts extends Token {
  amount?: number
  amountRendered?: string
}

export interface DataType {
  [key: string]: string | number | Amounts | Coin; // kind of deactivating typing for DataType; last resort?
  key: React.Key;
  coin: Coin;
  portfolio: Amounts;
}

export function chainKeysToObject(val: any) {
  const result: { [ChainKey: string]: any } = {}
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

export interface TransferStep {
  action: Action
  estimate?: Estimate
  execution?: Execution
  id?: string
}
