import { message } from 'antd'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

import { ChainKey, Route, Token, TokenAmount } from '../types'
import { readDeactivatedWallets, readWallets } from './localStorage'

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

export const isWalletActivated = (address: string | null | undefined): boolean => {
  if (!address) return false
  const lowerCaseAddress = address.toLowerCase()
  const activeWallets = readWallets()
  const activeAddresses = activeWallets.map((address) => address.toLowerCase())
  return activeAddresses.includes(lowerCaseAddress)
}
/**
 * Parses seconds as time string in the format "02:25"
 * @param seconds
 */
export const parseSecondsAsTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) {
    return ' - '
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.ceil(seconds % 60)
  const prefix = remainingSeconds < 10 ? '0' : ''
  return `${minutes}:${prefix}${remainingSeconds}`
}

export const isZeroAddress = (address: string): boolean => {
  address = address.toLowerCase()
  return (
    address === ethers.constants.AddressZero ||
    address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  )
}

export const isLiFiRoute = (route: any): route is Route => {
  return (route as Route).steps !== undefined
}

export const getBalance = (
  currentBalances: { [ChainKey: string]: Array<TokenAmount> } | undefined,
  chainKey: ChainKey,
  tokenId: string,
) => {
  if (!currentBalances || !currentBalances[chainKey]) {
    return new BigNumber(0)
  }

  const formatPotentialZeroAddress = (address: string) => {
    if (isZeroAddress(address)) {
      return ethers.constants.AddressZero
    }
    return address
  }

  const tokenBalance = currentBalances[chainKey].find(
    (tokenAmount) =>
      formatPotentialZeroAddress(tokenAmount.address) === formatPotentialZeroAddress(tokenId),
  )
  return tokenBalance?.amount ? new BigNumber(tokenBalance?.amount) : new BigNumber(0)
}

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    message.success('Message copied to clipboard!')
  } catch {
    message.error('Copying failed!')
  }
}

export const timeStampExceedsIntervalMinutes = (timeInMinutes: number, timestamp?: number) => {
  if (!timestamp) return false

  const timeInMilliseconds = timeInMinutes * 60 * 1000
  const lowerBarrier = Date.now() - timeInMilliseconds
  return timestamp < lowerBarrier
}
