import { ChainId, Token, TokenAmount } from '@lifi/sdk'

import covalent from './covalent'
import debank from './debank'
import { filterBlockedTokenAmounts } from './utils'

export const getTokenBalancesFromDebank = async (
  walletAddress: string,
  tokens?: Token[],
): Promise<TokenAmount[]> => {
  const tokenAmounts: TokenAmount[] = []

  try {
    const result = await debank.getBalances(walletAddress)
    tokenAmounts.push(...result)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed accessing Debank, switching to covalent', e)
    const onChains = tokens && tokens.map((token) => token.chainId)
    const uniqueChains = Array.from(new Set<ChainId>(onChains)) // remove duplicates by putting in  a set
    tokenAmounts.push(...(await covalent.getBalances(walletAddress, uniqueChains)))
  }

  let requestedTokens: TokenAmount[]
  if (tokens) {
    requestedTokens = tokenAmounts.filter((tokenAmount) =>
      tokens.find((token) => token.address === tokenAmount.address),
    )
  } else {
    requestedTokens = tokenAmounts
  }

  return filterBlockedTokenAmounts(requestedTokens)
}

export const getTokenBalanceFromDebank = async (
  walletAddress: string,
  token: Token,
): Promise<TokenAmount | null> => {
  const tokenAmounts = await getTokenBalancesFromDebank(walletAddress, [token])
  return tokenAmounts.length ? tokenAmounts[0] : null
}

export const getTokenBalancesForChainsFromDebank = async (
  walletAddress: string,
  tokensByChain?: { [chainId: number]: Token[] },
): Promise<{ [chainId: number]: TokenAmount[] }> => {
  const tokenAmounts = await getTokenBalancesFromDebank(
    walletAddress,
    tokensByChain ? Object.values(tokensByChain).flat() : undefined,
  )

  const result: { [chainId: number]: TokenAmount[] } = {}
  tokenAmounts.forEach((tokenAmount) => {
    if (!result[tokenAmount.chainId]) {
      result[tokenAmount.chainId] = []
    }

    result[tokenAmount.chainId].push(tokenAmount)
  })

  for (const key in ChainId) {
    const chainId = parseInt(ChainId[key])
    if (!result[chainId]) {
      result[chainId] = []
    }
  }

  return result
}
