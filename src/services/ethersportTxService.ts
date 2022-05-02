import { BigNumberish, ethers } from 'ethers'

import {
  erc20Abi,
  KLIMA_CARBON_OFFSET_CONTRACT,
  STAKE_KLIMA_CONTRACT_ADDRESS,
  stakeKlimaAbi,
} from '../constants'
import KlimaRetirementAggregator from '../constants/abis/KlimaRetirementAggregator.json'

export const getSetAllowanceTransaction = async (
  tokenAddress: string,
  approvalAddress: string,
  amount: BigNumberish,
) => {
  const erc20 = new ethers.Contract(tokenAddress, erc20Abi)
  return erc20.populateTransaction.approve(approvalAddress, amount)
}

export const getOffsetCarbonTransaction = (params: {
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
  return contract.populateTransaction.retireCarbon(
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
export const getStakeKlimaTransaction = (amount: BigNumberish) => {
  const contract = new ethers.Contract(STAKE_KLIMA_CONTRACT_ADDRESS, stakeKlimaAbi)
  return contract.populateTransaction.stake(amount)
}
