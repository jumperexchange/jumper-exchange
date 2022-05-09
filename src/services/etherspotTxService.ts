import { Token } from '@lifinance/sdk'
import { BigNumber, BigNumberish, ethers } from 'ethers'

import {
  erc20Abi,
  KLIMA_CARBON_OFFSET_CONTRACT,
  STAKE_KLIMA_CONTRACT_ADDRESS,
  stakeKlimaAbi,
} from '../constants'
import KlimaRetirementAggregator from '../constants/abis/KlimaRetirementAggregator.json'

const ETHERSPOT_LIFI_WALLET = process.env.REACT_APP_LIFI_ETHERSPOT_WALLET

export const getSetAllowanceTransaction = async (
  tokenAddress: string,
  approvalAddress: string,
  amount: BigNumberish,
) => {
  const erc20 = new ethers.Contract(tokenAddress, erc20Abi)
  return erc20.populateTransaction.approve(approvalAddress, amount)
}

export const getOffsetCarbonTransaction = async (params: {
  address: string
  inputTokenAddress: string
  retirementTokenAddress: string
  quantity: string
  amountInCarbon: boolean
  beneficiaryAddress?: string
  beneficiaryName?: string
  retirementMessage?: string
  specificAddresses?: string[]
}) => {
  const contract = new ethers.Contract(KLIMA_CARBON_OFFSET_CONTRACT, KlimaRetirementAggregator.abi)
  return await contract.populateTransaction.retireCarbon(
    params.inputTokenAddress,
    params.retirementTokenAddress,
    params.quantity,
    params.amountInCarbon,
    params.beneficiaryAddress || params.address,
    params.beneficiaryName || '',
    params.retirementMessage || '',
  )
}
export const getTransferTransaction = async (
  tokenAddress: string,
  toAddress: string,
  amount: BigNumberish,
) => {
  const erc20 = new ethers.Contract(tokenAddress, erc20Abi)
  return erc20.populateTransaction.transfer(toAddress, amount)
}

export const getFeeTransferTransactionBasedOnAmount = async (token: Token, amount: BigNumber) => {
  const lowBoundary = ethers.utils.parseUnits('100', token.decimals)
  const midBoundary = ethers.utils.parseUnits('3000', token.decimals)
  const highBoundary = ethers.utils.parseUnits('30000', token.decimals)
  const fixedFee = '0,5'
  let feePercent: string | undefined

  if (amount.lt(lowBoundary)) {
    feePercent = undefined
  } else if (amount.lt(midBoundary)) {
    feePercent = '0.005'
  } else if (amount.lt(highBoundary)) {
    feePercent = '0.003'
  } else {
    feePercent = '0.001'
  }
  const bnFeePercent = ethers.utils.parseUnits(feePercent || '0', token.decimals)
  const feeAmount = feePercent ? amount.mul(bnFeePercent) : fixedFee
  const erc20 = new ethers.Contract(token.address, erc20Abi)
  return erc20.populateTransaction.transfer(ETHERSPOT_LIFI_WALLET, feeAmount)
}

export const getStakeKlimaTransaction = (amount: BigNumberish) => {
  const contract = new ethers.Contract(STAKE_KLIMA_CONTRACT_ADDRESS, stakeKlimaAbi)
  return contract.populateTransaction.stake(amount)
}
