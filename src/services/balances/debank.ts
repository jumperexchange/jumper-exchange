import {
  ChainKey,
  CoinKey,
  findTokenByChainIdAndAddress,
  getChainByKey,
  TokenAmount,
} from '@lifinance/types'
import axios from 'axios'
import { BigNumber } from 'bignumber.js'
import { ethers } from 'ethers'

type DebankResultItem = {
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

const mapDebankChainNameToChainKey = (chainName: string): ChainKey => {
  return chainNameMapping[chainName]
}

const getBalances = async (walletAdress: string): Promise<TokenAmount[]> => {
  const tokenListUrl = `https://openapi.debank.com/v1/user/token_list?id=${walletAdress}&is_all=true`

  var result
  try {
    result = await axios.get<DebankResultItem[]>(tokenListUrl)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Debank api call for token list failed with status ` + e)
    throw e
  }

  // response body is empty?
  var debankResult: DebankResultItem[] = Object.keys(result.data).length === 0 ? [] : result.data

  // build return object
  const tokenAmounts: TokenAmount[] = []

  for (const debankResultItem of debankResult) {
    const chainKey = mapDebankChainNameToChainKey(debankResultItem.chain)
    let chain
    try {
      chain = getChainByKey(chainKey)
    } catch {
      // unknown chain
      continue
    }
    const tokenAddress = ethers.utils.isAddress(debankResultItem.id)
      ? debankResultItem.id
      : '0x0000000000000000000000000000000000000000'
    const localToken = findTokenByChainIdAndAddress(chain.id, tokenAddress)
    const amount = new BigNumber(debankResultItem.amount).toString()
    const priceUSD = new BigNumber(debankResultItem.price).toString()

    if (localToken) {
      tokenAmounts.push({
        ...localToken,
        amount,
        priceUSD,
      })
    } else {
      tokenAmounts.push({
        id: tokenAddress,
        name: debankResultItem.name,
        key: debankResultItem.symbol as CoinKey,
        chainId: chain.id,
        chainKey: chain.key,
        symbol: debankResultItem.optimized_symbol,
        logoURI: debankResultItem.logo_url,
        decimals: debankResultItem.decimals,
        amount,
        priceUSD,
      })
    }
  }

  return tokenAmounts
}

export default {
  getBalances,
}
