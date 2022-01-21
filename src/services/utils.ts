import BigNumber from 'bignumber.js'

import { Token } from '../types'
import { readDeactivatedWallets } from './localStorage'

export const formatTokenAmount = (token: Token, amount: string | undefined) => {
  if (!amount) {
    return '- ' + token.symbol
  }

  return formatTokenAmountOnly(token, amount) + ' ' + token.symbol
}

export const formatTokenAmountOnly = (token: Token, amount: string | BigNumber | undefined) => {
  if (!amount) {
    return '0.0'
  }

  let floated
  if (typeof amount === 'string') {
    if (amount === '0') {
      return '0.0'
    }

    floated = new BigNumber(amount).shiftedBy(-token.decimals)
  } else {
    floated = amount

    if (floated.isZero()) {
      return '0.0'
    }
  }

  // show at least 4 decimal places and at least two non-zero digests
  let decimalPlaces = 3
  // since values can in theory be negative we need to use the absolute value to determine the decimal places
  while (floated.absoluteValue().lt(1 / 10 ** decimalPlaces)) decimalPlaces++
  return floated.toFixed(decimalPlaces + 1, 1)
}

export const deepClone = (src: any) => {
  return JSON.parse(JSON.stringify(src))
}

export const sleep = (mills: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, mills)
  })
}

export const isWalletDeactivated = (address: string | null | undefined): boolean => {
  if (!address) return false
  const lowerCaseAddress = address.toLowerCase()
  const deactivatedWallets = readDeactivatedWallets()
  const deactivatedAddresses = deactivatedWallets.map((address) => address.toLowerCase())
  return deactivatedAddresses.includes(lowerCaseAddress)
}
