import { Token } from '../types'
import { getChainById, wrappedTokens } from '../types/lists'

export const formatTokenAmount = (token: Token, amount: number | undefined) => {
  if (!amount) {
    return '- ' + token.symbol
  }

  const floated = amount / 10 ** token.decimals
  return floated.toFixed(4) + ' ' + token.symbol
}

export const checkWrappedTokenId = (chainId: number, tokenId: string) => {
  if (tokenId !== '0x0000000000000000000000000000000000000000') {
    return tokenId
  }

  return wrappedTokens[getChainById(chainId).key].id
}
