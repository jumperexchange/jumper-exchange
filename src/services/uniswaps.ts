import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'

import { Action, Estimate } from '../types'

const USE_EXACT_IN = true

const uniswapRouter02ABI = [
  'function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',
  'function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)',

  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',

  'function swapExactTokensForTokens (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
  'function swapTokensForExactTokens( uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
]

const swappedTypes: Array<ethers.utils.ParamType> = [
  // ethers.utils.ParamType.from({
  //   "indexed": true,
  //   "internalType": "address",
  //   "name": "sender",
  //   "type": "address"
  // }),
  ethers.utils.ParamType.from({
    indexed: false,
    internalType: 'uint256',
    name: 'amount0In',
    type: 'uint256',
  }),
  ethers.utils.ParamType.from({
    indexed: false,
    internalType: 'uint256',
    name: 'amount1In',
    type: 'uint256',
  }),
  ethers.utils.ParamType.from({
    indexed: false,
    internalType: 'uint256',
    name: 'amount0Out',
    type: 'uint256',
  }),
  ethers.utils.ParamType.from({
    indexed: false,
    internalType: 'uint256',
    name: 'amount1Out',
    type: 'uint256',
  }),
  // ethers.utils.ParamType.from({
  //   "indexed": true,
  //   "internalType": "address",
  //   "name": "to",
  //   "type": "address"
  // }),
]
interface Swapped {
  sender: string
  amount0In: BigNumber
  amount1In: BigNumber
  amount0Out: BigNumber
  amount1Out: BigNumber
  to: string
}

export const getSwapCall = async (
  action: Action,
  estimate: Estimate,
  srcAddress: string,
  destAddress: string,
  // eslint-disable-next-line max-params
) => {
  const contract = new ethers.Contract(estimate.data.routerAddress, uniswapRouter02ABI)

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time

  if (USE_EXACT_IN) {
    // Exact In
    if (action.fromToken.id === ethers.constants.AddressZero) {
      const data = await contract.populateTransaction.swapExactETHForTokens(
        estimate.toAmountMin,
        estimate.data.path,
        destAddress,
        deadline,
      )
      data.value = BigNumber.from(estimate.fromAmount)
      return data
    } else if (action.toToken.id === ethers.constants.AddressZero) {
      return await contract.populateTransaction.swapExactTokensForETH(
        estimate.fromAmount,
        estimate.toAmountMin,
        estimate.data.path,
        destAddress,
        deadline,
      )
    } else {
      return await contract.populateTransaction.swapExactTokensForTokens(
        estimate.fromAmount,
        estimate.toAmountMin,
        estimate.data.path,
        destAddress,
        deadline,
      )
    }
  } else {
    // Exact Out
    if (action.fromToken.id === ethers.constants.AddressZero) {
      const data = await contract.populateTransaction.swapETHForExactTokens(
        estimate.toAmountMin,
        estimate.data.path,
        destAddress,
        deadline,
      )
      data.value = BigNumber.from(estimate.fromAmount)
      return data
    } else if (action.toToken.id === ethers.constants.AddressZero) {
      return await contract.populateTransaction.swapTokensForExactETH(
        estimate.toAmountMin,
        estimate.fromAmount,
        estimate.data.path,
        destAddress,
        deadline,
      )
    } else {
      return await contract.populateTransaction.swapTokensForExactTokens(
        estimate.toAmountMin,
        estimate.fromAmount,
        estimate.data.path,
        destAddress,
        deadline,
      )
    }
  }
}

export const parseReceipt = (tx: TransactionResponse, receipt: TransactionReceipt) => {
  const result = {
    fromAmount: '0',
    toAmount: '0',
    gasUsed: '0',
    gasPrice: '0',
    gasFee: '0',
  }
  const decoder = new ethers.utils.AbiCoder()

  // gas
  result.gasUsed = receipt.gasUsed.toString()
  result.gasPrice = tx.gasPrice?.toString() || '0'
  result.gasFee = receipt.gasUsed.mul(result.gasPrice).toString()

  // log
  receipt.logs.forEach((log) => {
    try {
      const parsed = decoder.decode(swappedTypes, log.data) as unknown as Swapped
      if (result.fromAmount === '0') {
        result.fromAmount = parsed.amount0In.isZero()
          ? parsed.amount1In.toString()
          : parsed.amount0In.toString()
      }
      result.toAmount = parsed.amount0Out.isZero()
        ? parsed.amount1Out.toString()
        : parsed.amount0Out.toString()
    } catch {
      // ignore, only matching will be parsed
    }
  })

  return result
}
