import axios from 'axios'

import { CoinKey, defaultTokens, getChainById, Token } from '../types'

export interface TokenListToken {
  chainId: number
  address: string
  name: string
  symbol: string
  decimals: number
  logoURI: string
}

export const loadTokenList = async (chainId: number): Promise<Array<TokenListToken>> => {
  const chain = getChainById(chainId)
  if (!chain.tokenlistUrl) {
    // throw new Error('No token list defined for chain')
    return [] as Array<TokenListToken>
  }
  const result = await axios.get<any>(chain.tokenlistUrl)
  if (result.data) {
    if (Object.keys(result.data).findIndex((key) => key === 'tokens') === -1) {
      return result.data as Array<TokenListToken>
    } else {
      return result.data.tokens as Array<TokenListToken>
    }
  } else {
    return [] as Array<TokenListToken>
  }
}

export const loadTokenListAsTokens = async (chainId: number): Promise<Array<Token>> => {
  const chain = getChainById(chainId)
  const tokenList = await loadTokenList(chainId)
  const filteredTokens = tokenList ? tokenList.filter((token) => token.chainId === chainId) : []
  const mappedTokens = filteredTokens.map((token) => {
    return {
      id: token.address.toLowerCase(),
      symbol: token.symbol,
      decimals: token.decimals,
      chainId: token.chainId,
      name: token.name.replace(' on xDai', ''),
      logoURI: token.logoURI,

      chainKey: chain.key,
      key: token.symbol as CoinKey,
    } as Token
  })

  // default token
  defaultTokens[chain.key].forEach((defaultToken) => {
    const found = !!mappedTokens.find(
      (token) => token.id.toLowerCase() === defaultToken.id.toLowerCase(),
    )
    if (!found) {
      mappedTokens.unshift(defaultToken)
    }
  })

  return mappedTokens
}
