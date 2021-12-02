import { Token, TokenAmount } from '@lifinance/types'

import { getBalancesFromProviderUsingMulticall } from './utils'

const getTokenBalances = async (walletAddress: string, tokens: Token[]): Promise<TokenAmount[]> => {
  let tokenAmounts: TokenAmount[] = []

  try {
    tokenAmounts = await getBalancesFromProviderUsingMulticall(walletAddress, tokens)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to load token balance via multicall', e)
  }

  if (tokens) {
    return tokenAmounts.filter((tokenAmount) => tokens.find((token) => token.id === tokenAmount.id))
  }

  return tokenAmounts
}

const getTokenBalance = async (
  walletAddress: string,
  token: Token,
): Promise<TokenAmount | null> => {
  const tokenAmounts = await getTokenBalances(walletAddress, [token])
  return tokenAmounts.length ? tokenAmounts[0] : null
}

const getTokenBalancesForChains = async (
  walletAddress: string,
  tokensByChain: { [chainId: number]: Token[] },
): Promise<{ [chainId: number]: TokenAmount[] }> => {
  const tokenAmounts = await getTokenBalances(walletAddress, Object.values(tokensByChain).flat())

  const result: { [chainId: number]: TokenAmount[] } = {}
  tokenAmounts.forEach((tokenAmount) => {
    if (!result[tokenAmount.chainId]) {
      result[tokenAmount.chainId] = []
    }

    result[tokenAmount.chainId].push(tokenAmount)
  })

  return result
}

export default {
  getTokenBalancesForChains,
  getTokenBalances,
  getTokenBalance,
}
