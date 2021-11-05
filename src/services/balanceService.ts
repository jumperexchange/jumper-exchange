/* eslint-disable no-console */
// @ts-ignore
import { createWatcher } from '@makerdao/multicall'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import { constants, ethers } from 'ethers'

import { getMulticallAddresses, getRpcUrls } from '../components/web3/connectors'
import {
  ChainId,
  ChainKey,
  chainKeysToObject,
  ChainPortfolio,
  defaultTokens,
  getChainById,
  Token,
} from '../types'
import { deepClone } from './utils'

type tokenListDebankT = {
  id: string
  chain: string
  name: string
  symbol: string
  display_symbol: string
  optimized_symbol: string
  decimals: number
  logo_url: string
  price: number
  is_verified: boolean
  is_core: boolean
  is_wallet: boolean
  time_at: number
  amount: number
}

type Portfolio = {
  [ChainKey: string]: Array<ChainPortfolio>
}

type Blacklist = {
  [ChainKey: string]: Array<string>
}

export const EMPTY_PORTFOLIO: Portfolio = chainKeysToObject([])

const tokenBlacklist: Blacklist = {
  [ChainKey.BSC]: [
    '0x119e2ad8f0c85c6f61afdf0df69693028cdc10be', // Zepe.io - scam
    '0xb0557906c617f0048a700758606f64b33d0c41a6', // Zepe.io - scam
    '0xbc6675de91e3da8eac51293ecb87c359019621cf', // BestAir.io - scam
    '0xb926beb62d7a680406e06327c87307c1ffc4ab09', // AlpacaDrop.Org - ??
    '0xb16600c510b0f323dee2cb212924d90e58864421', // GoFlux.io - ??
    '0x8ee3e98dcced9f5d3df5287272f0b2d301d97c57', // AirStack.net - scam
    '0x5558447b06867ffebd87dd63426d61c868c45904', // https://bnbw.me/ - scam
    '0x373233a38ae21cf0c4f9de11570e7d5aa6824a1e', // ALPACAFIN.COM - scam
  ],
  [ChainKey.POL]: [
    '0xe4fb1bb8423417a460286b0ed44b64e104c5fae5', // Zepe.io - scam
    '0x8ae127d224094cb1b27e1b28a472e588cbcc7620', // https://aaxexchange.org/ - scam
    '0x6142f62e7996faec5c5bb9d10669d60299d69dfe', // buy SpaceRat.Finance - spam
    '0x19a935cbaaa4099072479d521962588d7857d717', // Litcoin - fake
    '0x0364c8dbde082372e8d6a6137b45613dd0f8138a', // https://polybest.org/ - scam
    '0x81067076dcb7d3168ccf7036117b9d72051205e2', // DxDex.io - scam
  ],
}

const filterPortfolioWithBlacklist = (portfolio: Portfolio, blacklist: Blacklist) => {
  Object.keys(portfolio).forEach((chainKey) => {
    portfolio[chainKey] = portfolio[chainKey].filter((chainPortfolioItem) => {
      const blacklisted =
        blacklist[chainKey] && blacklist[chainKey].indexOf(chainPortfolioItem.id) !== -1
      return !blacklisted
    })
  })
  return portfolio
}

const COVALENT_API_KEY = 'ckey_538ec97ac4594396bda51a91df1'
const COVALENT_API_URI = 'https://api.covalenthq.com/v1'
const COVALENT_SUPPORTED_CHAINS = [
  ChainId.ETH, // Ethereum Mainnet
  ChainId.POL, // Polygon/Matic Mainnet
  ChainId.BSC, // Binance Smart Chain
  ChainId.AVA, // Avalanche C-Chain Mainnet
  ChainId.FTM, // Fantom Opera Mainnet

  // Testnets
  ChainId.MUM, // Polygon/Matic Mumbai Testnet
  //43113,  // Fuji C-Chain Testnet
]
export async function covalentGetCoinsOnChain(walletAdress: string, chainId: number) {
  const url = `${COVALENT_API_URI}/${chainId}/address/${walletAdress}/balances_v2/?key=${COVALENT_API_KEY}`
  let result
  try {
    result = await axios.get<any>(url)
  } catch (e) {
    console.error(e)
    return []
  }

  const portfolio: Array<ChainPortfolio> = []
  for (const token of result.data.data.items) {
    if (token.balance !== '0') {
      portfolio.push({
        id: token.contract_address,
        name: token.contract_name,
        symbol: token.contract_ticker_symbol,
        img_url: token.logo_url,
        amount: new BigNumber(token.balance).shiftedBy(-token.contract_decimals),
        pricePerCoin: new BigNumber(token.quote_rate || 0),
        verified: false,
      })
    }
  }

  return portfolio
}

const getBlancesFromCovalent = async (walletAdress: string, onChains?: Array<number>) => {
  let requestChains: Array<number>
  if (onChains) {
    requestChains = onChains.filter((chainId) => {
      if (COVALENT_SUPPORTED_CHAINS.indexOf(chainId) !== -1) {
        return true
      } else {
        console.warn(`Trying to request unsupported chain ${chainId} from Covalent.`)
        return false
      }
    })
  } else {
    requestChains = COVALENT_SUPPORTED_CHAINS
  }

  const totalPortfolio: Portfolio = deepClone(EMPTY_PORTFOLIO)
  const promises = requestChains.map(async (chainId) => {
    const chain = getChainById(chainId)
    const balances = await covalentGetCoinsOnChain(walletAdress, chainId)
    totalPortfolio[chain.key] = balances
  })
  await Promise.allSettled(promises)

  return totalPortfolio
}

/* INFO: DEBANK API goes against our initial way of looking on all chains for a given coinId;
it looks for all coins for a given chain -> its reversed!!!
*/
async function getCoinsOnChain(walletAdress: string, chainKey: ChainKey) {
  walletAdress = walletAdress.toLowerCase()
  const ChainString: string = chainKey.toString()
  const tokenListUrl = `https://openapi.debank.com/v1/user/token_list?id=${walletAdress}&chain_id=${ChainString}&is_all=true`

  var result
  try {
    result = await axios.get<any>(tokenListUrl)
  } catch (e) {
    console.warn(`Debank api call for token list on chain ${chainKey} failed with status ` + e)
    console.warn(e)
    return []
  }

  var tokenList: Array<tokenListDebankT>
  // response body is empty?
  if (Object.keys(result.data).length === 0) {
    return []
  } else {
    tokenList = result.data
  }

  // build return object
  var balanceArray: Array<ChainPortfolio> = []
  for (const token of tokenList) {
    balanceArray.push({
      id: token.id,
      name: token.name,
      symbol: token.optimized_symbol,
      img_url: token.logo_url,
      amount: new BigNumber(token.amount),
      pricePerCoin: new BigNumber(token.price),
      verified: token.is_verified,
    })
  }

  return balanceArray
}

// Crazy Wallet for testing token parsing: 0x5853ed4f26a3fcea565b3fbc698bb19cdf6deb85
const chainNameMapping: { [ChainName: string]: ChainKey } = {
  eth: ChainKey.ETH,
  bsc: ChainKey.BSC,
  xdai: ChainKey.DAI,
  matic: ChainKey.POL,
  ftm: ChainKey.FTM,
  okt: ChainKey.OKT,
  avax: ChainKey.AVA,
  heco: ChainKey.HEC,
  op: ChainKey.OPT,
  arb: ChainKey.ARB,
  // 'celo': Celo
}
function mapDebankChainNameToChainKey(chainName: string) {
  return chainNameMapping[chainName]
}

const getBlancesFromDebank = async (walletAdress: string) => {
  const tokenListUrl = `https://openapi.debank.com/v1/user/token_list?id=${walletAdress}&is_all=true`

  var result
  try {
    result = await axios.get<any>(tokenListUrl)
  } catch (e) {
    console.warn(`Debank api call for token list failed with status ` + e)
    throw e
  }

  // response body is empty?
  var tokenList: Array<tokenListDebankT> = Object.keys(result.data).length === 0 ? [] : result.data

  // build return object
  const totalPortfolio: Portfolio = deepClone(EMPTY_PORTFOLIO)
  for (const token of tokenList) {
    totalPortfolio[mapDebankChainNameToChainKey(token.chain)]?.push({
      id: ethers.utils.isAddress(token.id)
        ? token.id
        : '0x0000000000000000000000000000000000000000',
      name: token.name,
      symbol: token.optimized_symbol,
      img_url: token.logo_url,
      amount: new BigNumber(token.amount),
      pricePerCoin: new BigNumber(token.price),
      verified: token.is_verified,
    })
  }

  return totalPortfolio
}

const getBalancesForWallet = async (
  walletAdress: string,
  onChains?: Array<number>,
): Promise<Portfolio> => {
  walletAdress = walletAdress.toLowerCase()

  // Manually added Harmony Support
  let onePromise: Promise<{ [ChainKey: string]: ChainPortfolio[] }> | undefined
  if (onChains && onChains.indexOf(ChainId.ONE) !== -1) {
    const tokens = {
      [ChainKey.ONE]: defaultTokens[ChainKey.ONE],
    }
    onePromise = getBalancesForWalletFromChain(walletAdress, tokens)
  }

  let protfolio: Portfolio
  try {
    protfolio = await getBlancesFromDebank(walletAdress)
  } catch {
    protfolio = await getBlancesFromCovalent(walletAdress, onChains)
  }

  // Manually added Harmony Support - wait for balances
  if (onePromise) {
    try {
      const onePortfolio = await onePromise
      protfolio[ChainKey.ONE] = onePortfolio[ChainKey.ONE]
    } catch (e: any) {
      console.error('Failed access harmony balance', e)
    }
  }

  return filterPortfolioWithBlacklist(protfolio, tokenBlacklist)
}

export const getBalanceFromProvider = async (
  address: string,
  tokens: Array<Token>,
): Promise<Array<any>> =>
  new Promise((resolve) => {
    // Configuration
    const chainId = tokens[0].chainId
    const config = {
      rpcUrl: getRpcUrls([chainId])[chainId],
      multicallAddress: getMulticallAddresses([chainId])[chainId],
      interval: 10000,
    }

    // Collect calls we want to make
    const calls: Array<any> = []
    tokens.forEach(async (token) => {
      if (token.id === constants.AddressZero) {
        calls.push({
          call: ['getEthBalance(address)(uint256)', address],
          returns: [
            [
              [token.id, token.name, token.key].join('-'),
              (val: number) => new BigNumber(val).shiftedBy(-token.decimals).toFixed(),
            ],
          ],
        })
      } else {
        calls.push({
          target: token.id,
          call: ['balanceOf(address)(uint256)', address],
          returns: [
            [
              [token.id, token.name, token.key].join('-'),
              (val: number) => new BigNumber(val).shiftedBy(-token.decimals).toFixed(),
            ],
          ],
        })
      }
    })

    const watcher = createWatcher(calls, config)

    // Success case
    watcher.batch().subscribe((updates: any) => {
      watcher.stop()
      resolve(updates as any)
    })

    // Error case
    watcher.onError((error: any) => {
      watcher.stop()
      console.warn('Watcher Error:', error)
      resolve([])
    })

    // Submit calls
    watcher.start()
  })

export const getBalancesForWalletFromChain = async (
  address: string,
  tokens: { [ChainKey: string]: Array<Token> },
) => {
  const portfolio: { [ChainKey: string]: Array<ChainPortfolio> } = chainKeysToObject([])
  const promises: Array<Promise<any>> = []
  Object.entries(tokens).forEach(async ([chainKey, tokens]) => {
    const promise = getBalanceFromProvider(address, tokens)
    promises.push(promise)
    const amounts = await promise

    amounts.forEach((amount) => {
      const [token_id, token_name, token_key] = amount['type'].split('-')

      portfolio[chainKey].push({
        id: token_id,
        name: token_name,
        symbol: token_key,
        img_url: '',
        amount: new BigNumber(amount.value),
        pricePerCoin: new BigNumber(0),
        verified: false,
      })
    })
  })

  await Promise.allSettled(promises)
  return portfolio
}

export { getBalancesForWallet, getCoinsOnChain }
