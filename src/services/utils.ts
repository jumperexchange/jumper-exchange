import { Token } from '../types'
import { getChainById, wrappedTokens } from '../types/lists'

export const formatTokenAmount = (token: Token, amount: number | undefined) => {
  if (!amount) {
    return '- ' + token.symbol
  }

  return formatTokenAmountOnly(token, amount) + ' ' + token.symbol
}

export const formatTokenAmountOnly = (token: Token, amount: number | undefined) => {
  if (!amount) {
    return '0.0'
  }

  const floated = amount / 10 ** token.decimals
  return floated.toFixed(4)
}

export const checkWrappedTokenId = (chainId: number, tokenId: string) => {
  if (tokenId !== '0x0000000000000000000000000000000000000000') {
    return tokenId
  }

  return wrappedTokens[getChainById(chainId).key].id
}

export const deepClone = (src: any) => {
  return JSON.parse(JSON.stringify(src));
}
