import { ChainKey, Coin, CoinKey, findDefaultCoinOnChain, Token } from '@lifinance/types'
import { TableColumnType } from 'antd'
import BigNumber from 'bignumber.js'

import arb from '../assets/icons/arbitrum.svg'
import arbt from '../assets/icons/arbitrum_test.png'
import ava from '../assets/icons/avalanche.png'
import bsc from '../assets/icons/bsc.png'
import bsct from '../assets/icons/bsc_test.png'
import eth from '../assets/icons/ethereum.png'
import gor from '../assets/icons/ethereum_goerli.png'
import rin from '../assets/icons/ethereum_rinkeby.png'
import rop from '../assets/icons/ethereum_ropsten.png'
import ftm from '../assets/icons/fantom.png'
import one from '../assets/icons/harmony.png'
import onet from '../assets/icons/harmony_test.png'
import honey from '../assets/icons/honey.png'
import mor from '../assets/icons/moonriver.png'
import opt from '../assets/icons/optimism.png'
import pancake from '../assets/icons/pancake.png'
import pol from '../assets/icons/polygon.png'
import mum from '../assets/icons/polygon_test.png'
import quick from '../assets/icons/quick.png'
import spooky from '../assets/icons/spooky.png'
import sushi from '../assets/icons/sushi.png'
import uniswap from '../assets/icons/uniswap.png'
import viper from '../assets/icons/viper.png'
import dai from '../assets/icons/xdai.png'

export const defaultTokens: { [ChainKey: string]: Array<Token> } = {
  [ChainKey.ETH]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ETH),
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.ETH),
  ],
  [ChainKey.BSC]: [
    findDefaultCoinOnChain(CoinKey.BNB, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.BSC),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.BSC),
  ],
  [ChainKey.POL]: [
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.POL),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.POL),
  ],
  [ChainKey.DAI]: [
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.DAI),
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.DAI),
  ],
  [ChainKey.FTM]: [
    findDefaultCoinOnChain(CoinKey.FTM, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.FTM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.FTM),
  ],
  [ChainKey.ARB]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ARB),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ARB),
  ],
  [ChainKey.OPT]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.OPT),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.OPT),
  ],
  [ChainKey.ONE]: [
    findDefaultCoinOnChain(CoinKey.ONE, ChainKey.ONE),
    findDefaultCoinOnChain(CoinKey.BNB, ChainKey.ONE),
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ONE),
  ],
  [ChainKey.AVA]: [
    findDefaultCoinOnChain(CoinKey.AVAX, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.AVA),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.AVA),
  ],
  [ChainKey.MOR]: [
    findDefaultCoinOnChain(CoinKey.MOVR, ChainKey.MOR),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.MOR),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.MOR),
  ],

  // Testnet
  [ChainKey.GOR]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.GOR),
    // findDefaultCoinOnChain(CoinKey.USDT, ChainKey.GOR),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.GOR),
  ],
  [ChainKey.RIN]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.RIN),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.RIN),
  ],
  [ChainKey.ROP]: [
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.USDT, ChainKey.ROP),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.ROP),
  ],
  [ChainKey.KOV]: [findDefaultCoinOnChain(CoinKey.ETH, ChainKey.KOV)],
  [ChainKey.MUM]: [
    findDefaultCoinOnChain(CoinKey.MATIC, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.TEST, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.USDC, ChainKey.MUM),
    // findDefaultCoinOnChain(CoinKey.USDT, ChainKey.MUM),
    findDefaultCoinOnChain(CoinKey.DAI, ChainKey.MUM),
  ],
  [ChainKey.BSCT]: [findDefaultCoinOnChain(CoinKey.BNB, ChainKey.BSCT)],
  [ChainKey.ONET]: [
    findDefaultCoinOnChain(CoinKey.ONE, ChainKey.ONET),
    findDefaultCoinOnChain(CoinKey.ETH, ChainKey.ONET),
    findDefaultCoinOnChain(CoinKey.BNB, ChainKey.ONET),
  ],
}

export const icons: { [key: string]: string } = {
  // Mainnets
  [ChainKey.ETH]: eth,
  [ChainKey.POL]: pol,
  [ChainKey.BSC]: bsc,
  [ChainKey.DAI]: dai,
  // [ChainKey.OKT]: okt,
  [ChainKey.FTM]: ftm,
  [ChainKey.AVA]: ava,
  [ChainKey.ARB]: arb,
  // [ChainKey.HEC]: hec,
  [ChainKey.OPT]: opt,
  [ChainKey.ONE]: one,
  [ChainKey.MOR]: mor,

  // Testnets
  [ChainKey.ROP]: rop,
  [ChainKey.RIN]: rin,
  [ChainKey.GOR]: gor,
  [ChainKey.MUM]: mum,
  [ChainKey.ARBT]: arbt,
  //[ChainKey.OPTT]: optt,
  [ChainKey.BSCT]: bsct,
  //[ChainKey.HECT]: hect,
  [ChainKey.ONET]: onet,

  // Exchanges
  Pancakeswap: pancake,
  Quickswap: quick,
  Honeyswap: honey,
  Uniswap: uniswap,
  Spookyswap: spooky,
  Viperswap: viper,
  Sushiswap: sushi,
}
export const getIcon = (name: string | undefined) => {
  if (name && icons[name]) {
    return icons[name]
  }
  return undefined
}

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
