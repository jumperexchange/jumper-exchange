import BigNumber from 'bignumber.js'
import { getChainById, Token, wrappedTokens } from '../types'

export const formatTokenAmount = (token: Token, amount: string | undefined) => {
  if (!amount) {
    return '- ' + token.symbol
  }

  return formatTokenAmountOnly(token, amount) + ' ' + token.symbol
}

export const formatTokenAmountOnly = (token: Token, amount: string | undefined) => {
  if (!amount) {
    return '0.0'
  }

  const floated = new BigNumber(amount).shiftedBy(-token.decimals)
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

export const sleep = (mills: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, mills)
  })
}
