import { Token, TokenAmount } from '@lifinance/types'

import utils from './utils'

const getTokenBalance = async (
  walletAddress: string,
  token: Token,
): Promise<TokenAmount | null> => {
  const tokenAmounts = await getTokenBalances(walletAddress, [token])
  return tokenAmounts.length ? tokenAmounts[0] : null
}

const getTokenBalances = async (walletAddress: string, tokens: Token[]): Promise<TokenAmount[]> => {
  // split by chain
  const tokensByChain: { [chainId: number]: Token[] } = {}
  tokens.forEach((token) => {
    if (!tokensByChain[token.chainId]) {
      tokensByChain[token.chainId] = []
    }
    tokensByChain[token.chainId].push(token)
  })

  const tokenAmountsByChain = await getTokenBalancesForChains(walletAddress, tokensByChain)
  return Object.values(tokenAmountsByChain).flat()
}

const getTokenBalancesForChains = async (
  walletAddress: string,
  tokensByChain: { [chainId: number]: Token[] },
): Promise<{ [chainId: number]: TokenAmount[] }> => {
  const tokenAmountsByChain: { [chainId: number]: TokenAmount[] } = {}
  const promises = Object.keys(tokensByChain).map(async (chainIdStr) => {
    const chainId = parseInt(chainIdStr)
    const tokenAmounts = await utils.getBalances(walletAddress, tokensByChain[chainId])
    tokenAmountsByChain[chainId] = tokenAmounts
  })

  await Promise.allSettled(promises)
  return tokenAmountsByChain
}

export default {
  getTokenBalance,
  getTokenBalances,
  getTokenBalancesForChains,
}
