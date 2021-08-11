import { ChainKey, chainKeysToObject, ChainPortfolio } from '../types';
import axios from 'axios'
import { ethers } from 'ethers';
import { getChainByKey } from '../types/lists';
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

export const EMPTY_PORTFOLIO : {[ChainKey: string]: Array<ChainPortfolio>} = chainKeysToObject([])

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
async function covalentGetCoinsOnChain(walletAdress: string, chainId: number) {
  const url = `${COVALENT_API_URI}/${chainId}/address/${walletAdress}/balances_v2/?key=${COVALENT_API_KEY}`
  let result
  try {
    result = await axios.get(url)
  } catch (e) {
    console.error(e)
    return []
  }

  const portfolio : Array<ChainPortfolio> = []
  for (const token of result.data.data.items) {
    if (token.balance !== '0') {
      portfolio.push({
        id: token.contract_address,
        name: token.contract_name,
        symbol: token.contract_ticker_symbol,
        img_url: token.logo_url,
        amount: parseInt(token.balance) / (10**token.contract_decimals),
        pricePerCoin: token.quote_rate || 0,
      })
    }
  }

  return portfolio
}

/* INFO: DEBANK API goes against our initial way of looking on all chains for a given coinId;
it looks for all coins for a given chain -> its reversed!!!
*/
async function getCoinsOnChain(walletAdress: string, chainKey: ChainKey){
  walletAdress = walletAdress.toLowerCase()
  const ChainString: string = chainKey.toString()
  const tokenListUrl = `https://openapi.debank.com/v1/user/token_list?id=${walletAdress}&chain_id=${ChainString}&is_all=true`

  var result
  try{
    result = await axios.get(tokenListUrl);
  } catch (e){
    console.warn(`Debank api call for token list on chain ${chainKey} failed with status ` + e)
    console.warn(e)
    return []
  }

  var tokenList: Array<tokenListDebankT>;
  // response body is empty?
  if (Object.keys(result.data).length === 0){
    return [];
  } else{
    tokenList = result.data
  }

  // build return object
  var balanceArray: Array<ChainPortfolio> = []
  for (const token of tokenList){
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

const chainNameMapping : {[ChainName: string]: ChainKey} = {
  'eth': ChainKey.ETH,
  'bsc': ChainKey.BSC,
  'xdai': ChainKey.DAI,
  'matic': ChainKey.POL,
  'ftm': ChainKey.FTM,
  'okt': ChainKey.OKT,
  // 'heco': ChainKey.??,
}
function mapDebankChainNameToChainKey(chainName: string) {
  return chainNameMapping[chainName]
}

async function getBalancesForWallet(walletAdress: string){
  walletAdress = walletAdress.toLowerCase()

  const covalentAVAPromise = covalentGetCoinsOnChain(walletAdress, getChainByKey(ChainKey.AVA).id)

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
  const totalPortfolio : {[ChainKey: string]: Array<ChainPortfolio>} = deepClone(EMPTY_PORTFOLIO)
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

  totalPortfolio[ChainKey.AVA] = await covalentAVAPromise
  return totalPortfolio
}

export { getCoinsOnChain , getBalancesForWallet }
