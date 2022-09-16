import {
  ChainId,
  CoinKey,
  findTokenByChainIdAndAddress,
  getChainById,
  TokenAmount,
} from '@lifi/sdk'
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
// Available Chains: https://openapi.debank.com/docs
const chainNameMapping: { [ChainName: string]: ChainId } = {
  eth: ChainId.ETH,
  bsc: ChainId.BSC,
  xdai: ChainId.DAI,
  matic: ChainId.POL,
  ftm: ChainId.FTM,
  okt: ChainId.OKT,
  heco: ChainId.HEC,
  avax: ChainId.AVA,
  arb: ChainId.ARB,
  celo: ChainId.CEL,
  movr: ChainId.MOR,
  op: ChainId.OPT,
  cro: ChainId.CRO,
  boba: ChainId.BOB,
  mobm: ChainId.MOO,
  metis: ChainId.MAM,
  fuse: ChainId.FUS,
  hmy: ChainId.ONE,
}

const supportedChains = Object.values(chainNameMapping)

const mapDebankChainNameToChainId = (chainName: string): ChainId => {
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
    const chainId = mapDebankChainNameToChainId(debankResultItem.chain)
    let chain
    try {
      chain = getChainById(chainId)
    } catch {
      // unknown chain
      continue
    }
    const tokenAddress = ethers.utils.isAddress(debankResultItem.id)
      ? debankResultItem.id
      : '0x0000000000000000000000000000000000000000'
    const localToken = findTokenByChainIdAndAddress(chain.id, tokenAddress)
    const amount = new BigNumber(debankResultItem.amount).toString()
    const priceUSD = debankResultItem.price
      ? new BigNumber(debankResultItem.price).toString()
      : undefined

    if (localToken) {
      tokenAmounts.push({
        ...localToken,
        amount,
        priceUSD,
      })
    } else {
      tokenAmounts.push({
        address: tokenAddress,
        name: debankResultItem.name,
        coinKey: debankResultItem.symbol as CoinKey,
        chainId: chain.id,
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
  supportedChains,
  getBalances,
}
