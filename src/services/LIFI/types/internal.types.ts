import { JsonRpcSigner } from '@ethersproject/providers'
import { ChainKey, Coin, CrossStep, LifiStep, SwapStep, Token } from '@lifinance/types'
import { TableColumnType } from 'antd'
import BigNumber from 'bignumber.js'

export interface Amounts {
  amount_coin: BigNumber
  amount_usd: BigNumber
}

export interface TokenWithAmounts extends Token {
  amount?: BigNumber
  amountRendered?: string
}

export interface DataType {
  [key: string]: string | number | Amounts | Coin // kind of deactivating typing for DataType; last resort?
  key: React.Key
  coin: Coin
  portfolio: Amounts
}

export function chainKeysToObject(val: any) {
  const result: { [ChainKey: string]: any } = {}
  for (const key in ChainKey) {
    result[key.toLowerCase()] = JSON.parse(JSON.stringify(val))
  }
  return result
}

export interface ColomnType extends TableColumnType<DataType> {
  children?: Array<ColomnType>
}

export interface ChainPortfolio {
  id: string
  name: string
  symbol: string
  img_url: string
  pricePerCoin: BigNumber
  amount: BigNumber
  verified: boolean
}

export interface Wallet {
  address: string
  loading: boolean
  portfolio: { [ChainKey: string]: Array<ChainPortfolio> } // ChainKeys -> [ChainPortfolio]
}

export enum Currencies {
  USD = 'usd',
  EUR = 'eur',
}

export interface SummaryAmounts {
  amount_usd: BigNumber
  percentage_of_portfolio: BigNumber
}

export interface WalletSummary {
  wallet: string
  [ChainKey.ETH]: SummaryAmounts
  [ChainKey.POL]: SummaryAmounts
  [ChainKey.BSC]: SummaryAmounts
  [ChainKey.DAI]: SummaryAmounts
  [ChainKey.OKT]: SummaryAmounts
  [ChainKey.FTM]: SummaryAmounts
  [ChainKey.AVA]: SummaryAmounts
  [ChainKey.HEC]: SummaryAmounts
  [ChainKey.OPT]: SummaryAmounts
  [ChainKey.ARB]: SummaryAmounts
  [ChainKey.ONE]: SummaryAmounts
  [ChainKey.FSN]: SummaryAmounts
  [ChainKey.MOR]: SummaryAmounts

  [ChainKey.ROP]: SummaryAmounts
  [ChainKey.RIN]: SummaryAmounts
  [ChainKey.GOR]: SummaryAmounts
  [ChainKey.KOV]: SummaryAmounts
  [ChainKey.MUM]: SummaryAmounts
  [ChainKey.ARBT]: SummaryAmounts
  [ChainKey.OPTT]: SummaryAmounts
  [ChainKey.BSCT]: SummaryAmounts
  [ChainKey.HECT]: SummaryAmounts
  [ChainKey.ONET]: SummaryAmounts
}

export interface ProgressStep {
  title: string
  description: string
}

export type ParsedReceipt = {
  fromAmount: string
  toAmount: string
  gasUsed: string
  gasPrice: string
  gasFee: string
}

export type ExecuteSwapParams = {
  signer: JsonRpcSigner
  step: SwapStep
  parseReceipt: (...args: any[]) => ParsedReceipt
  updateStatus?: Function
}

export type ExecuteCrossParams = {
  signer: JsonRpcSigner
  step: CrossStep | LifiStep
  updateStatus?: Function
}
