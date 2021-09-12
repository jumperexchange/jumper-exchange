import axios from 'axios';
import { ethers } from 'ethers';
import { ChainKey, chainKeysToObject, ChainPortfolio } from '../types';
import { deepClone } from './utils';

type tokenListDebankT = {
  id: string,
  chain: string,
  name: string,
  symbol: string,
  display_symbol: string,
  optimized_symbol: string,
  decimals: number,
  logo_url: string,
  price: number,
  is_verified: boolean,
  is_core: boolean,
  is_wallet: boolean,
  time_at: number,
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
  ]
}

const filterPortfolioWithBlacklist = (portfolio: Portfolio, blacklist: Blacklist) => {
  Object.keys(portfolio).forEach((chainKey) => {
    portfolio[chainKey] = portfolio[chainKey].filter((chainPortfolioItem) => {
      const blacklisted = blacklist[chainKey] && blacklist[chainKey].indexOf(chainPortfolioItem.id) !== -1
      return !blacklisted
    })
  })
  return portfolio
}

const COVALENT_API_KEY = 'ckey_538ec97ac4594396bda51a91df1'
const COVALENT_API_URI = 'https://api.covalenthq.com/v1'
// const COVALENT_SUPPORTED_CHAINS = {
//   1: 'Ethereum Mainnet',
//   137: 'Polygon/Matic Mainnet',
//   80001: 'Polygon/Matic Mumbai Testnet',
//   56: 'Binance Smart Chain',
//   43114: 'Avalanche C-Chain Mainnet',
//   43113: 'Fuji C-Chain Testnet',
//   250: 'Fantom Opera Mainnet',
// }
export async function covalentGetCoinsOnChain(walletAdress: string, chainId: number) {
  const url = `${COVALENT_API_URI}/${chainId}/address/${walletAdress}/balances_v2/?key=${COVALENT_API_KEY}`
  let result
  try {
    result = await axios.get(url)
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
        amount: parseInt(token.balance) / (10 ** token.contract_decimals),
        pricePerCoin: token.quote_rate || 0,
      })
    }
  }

  return portfolio
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
    result = await axios.get(tokenListUrl);
  } catch (e) {
    console.warn(`Debank api call for token list on chain ${chainKey} failed with status ` + e)
    console.warn(e)
    return []
  }

  var tokenList: Array<tokenListDebankT>;
  // response body is empty?
  if (Object.keys(result.data).length === 0) {
    return [];
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
      amount: token.amount as number,
      pricePerCoin: token.price as number,
    })
  }

  return balanceArray
}

// Crazy Wallet for testing token parsing: 0x5853ed4f26a3fcea565b3fbc698bb19cdf6deb85
const chainNameMapping: { [ChainName: string]: ChainKey } = {
  'eth': ChainKey.ETH,
  'bsc': ChainKey.BSC,
  'xdai': ChainKey.DAI,
  'matic': ChainKey.POL,
  'ftm': ChainKey.FTM,
  'okt': ChainKey.OKT,
  'avax': ChainKey.AVA,
  // 'heco': ChainKey.??, // - HECO
  // // - Optimistic Ethereum
  // // - Arbitrum
}
function mapDebankChainNameToChainKey(chainName: string) {
  return chainNameMapping[chainName]
}

const getBalancesForWallet = async (walletAdress: string): Promise<Portfolio> => {
  walletAdress = walletAdress.toLowerCase()

  const tokenListUrl = `https://openapi.debank.com/v1/user/token_list?id=${walletAdress}&is_all=true`

  var result
  try {
    result = await axios.get(tokenListUrl);
  } catch (e) {
    console.warn(`Debank api call for token list failed with status ` + e)
    console.warn(e)
    return deepClone(EMPTY_PORTFOLIO)
  }

  // response body is empty?
  var tokenList: Array<tokenListDebankT> = (Object.keys(result.data).length === 0) ? [] : result.data

  // build return object
  const totalPortfolio: Portfolio = deepClone(EMPTY_PORTFOLIO)
  for (const token of tokenList) {
    totalPortfolio[mapDebankChainNameToChainKey(token.chain)]?.push({
      id: ethers.utils.isAddress(token.id) ? token.id : '0x0000000000000000000000000000000000000000',
      name: token.name,
      symbol: token.optimized_symbol,
      img_url: token.logo_url,
      amount: token.amount as number,
      pricePerCoin: token.price as number,
    })
  }

  return filterPortfolioWithBlacklist(totalPortfolio, tokenBlacklist)
}

export { getCoinsOnChain, getBalancesForWallet };

