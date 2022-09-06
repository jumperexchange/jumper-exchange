import { Token } from '@lifi/sdk'
import { BigNumber as BigJs } from 'bignumber.js'
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

export const getCarbonOffsetSourceAmount = async (
  signerOrProvider: ethers.Signer | ethers.providers.Provider,
  params: {
    inputToken: Token
    retirementToken: Token
    amountInCarbon: string
  },
) => {
  const contract = new ethers.Contract(
    KLIMA_CARBON_OFFSET_CONTRACT,
    KlimaRetirementAggregator.abi,
    signerOrProvider,
  )

  const sourceAmount: [BigNumberish, BigNumberish] = await contract.getSourceAmount(
    params.inputToken.address,
    params.retirementToken.address,
    params.amountInCarbon,
    true,
  )

  // return {
  //   inputToken: ethers.utils.formatUnits(sourceAmount[0], params.inputToken.decimals),
  //   retirementToken: ethers.utils.formatUnits(sourceAmount[1], params.retirementToken.decimals),
  // }

  return {
    inputToken: sourceAmount[0].toString(),
    retirementToken: sourceAmount[1].toString(),
  }
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
  const bigJSAmount = new BigJs(amount.toString())
  const lowBoundary = ethers.utils.parseUnits('100', token.decimals)
  const midBoundary = ethers.utils.parseUnits('3000', token.decimals)
  const highBoundary = ethers.utils.parseUnits('30000', token.decimals)
  const fixedFee = new BigJs('0.5').shiftedBy(token.decimals)

  let feePercent: BigJs | undefined

  if (amount.lt(lowBoundary)) {
    feePercent = undefined
  } else if (amount.lt(midBoundary)) {
    // feePercent =
    feePercent = new BigJs(0.005)
  } else if (amount.lt(highBoundary)) {
    feePercent = new BigJs(0.003)
  } else {
    feePercent = new BigJs(0.003)
  }

  const feeAmountBigJS = feePercent ? bigJSAmount.times(feePercent) : fixedFee
  const feeAmount = BigNumber.from(feeAmountBigJS.toFixed(0))

  const erc20 = new ethers.Contract(token.address, erc20Abi)
  const txFee = await erc20.populateTransaction.transfer(ETHERSPOT_LIFI_WALLET, feeAmount)

  return {
    txFee,
    feeAmount,
  }
}

export const getStakeKlimaTransaction = (amount: BigNumberish) => {
  const contract = new ethers.Contract(STAKE_KLIMA_CONTRACT_ADDRESS, stakeKlimaAbi)
  return contract.populateTransaction.stake(amount)
}
