import { TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import { ChainId, SwapAction, SwapEstimate } from '../types'

const USE_EXACT_IN = false

const uniswapRouter02ABI = [
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",

  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",

  "function swapExactTokensForTokens (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapTokensForExactTokens( uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
]

const swappedTypes: Array<ethers.utils.ParamType> = [
  // ethers.utils.ParamType.from({
  //   "indexed": true,
  //   "internalType": "address",
  //   "name": "sender",
  //   "type": "address"
  // }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "amount0In",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "amount1In",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "amount0Out",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "amount1Out",
    "type": "uint256"
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

// Official routers
const uniswapRouters: { [chainId: number]: string } = {
  // Uniswap https://app.uniswap.org/#/swap
  [ChainId.ETH]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // router v2 https://uniswap.org/docs/v2/smart-contracts/router02/#address

  // BSC PancakeSwap https://docs.pancakeswap.finance/
  [ChainId.BSC]: "0x05ff2b0db69458a0750badebc4f9e13add608c7f", // router v1 https://bscscan.com/address/0x05ff2b0db69458a0750badebc4f9e13add608c7f#contracts
  //[ChainId.BSC]: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // router v2 https://bscscan.com/address/0x10ED43C718714eb63d5aA57B78B54704E256024E#code

  // xDAI Honeyswap https://wiki.1hive.org/projects/honeyswap/honeyswap-on-xdai-1
  [ChainId.DAI]: "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77", // router v2 https://blockscout.com/poa/xdai/address/0x1C232F01118CB8B424793ae03F870aa7D0ac7f77/contracts

  // Polygon QuickSwap https://github.com/QuickSwap/QuickSwap-subgraph/blob/master/subgraph.yaml => Factory 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32
  [ChainId.POL]: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", // router v2 https://explorer-mainnet.maticvigil.com/address/0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff/contracts

  [ChainId.FTM]: "0xf491e7b69e4244ad4002bc14e878a34207e38c29", // https://ftmscan.com/address/0xf491e7b69e4244ad4002bc14e878a34207e38c29
  // also FTMTESTNET = 4002?

  [ChainId.ONE]: "0xf012702a5f0e54015362cBCA26a26fc90AA832a3", // ViperSwap https://explorer.harmony.one/address/0xf012702a5f0e54015362cbca26a26fc90aa832a3?activeTab=7
  // [ChainId.ONE]: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506", // SushiSwap https://explorer.harmony.one/address/0x1b02da8cb0d097eb8d57a175b88c7d8b47997506?activeTab=7

  //TESTNET
  //UNiswap Testnet Router v2
  [ChainId.ROP]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [ChainId.RIN]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [ChainId.GOR]: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  [ChainId.ONET]: "0xda3DD48726278a7F478eFaE3BEf9a5756ccdb4D0",
}

export const getContractAddress = (chainId: number) => {
  return uniswapRouters[chainId]
}

export const getSwapCall = async (swapAction: SwapAction, swapEstimate: SwapEstimate, srcAddress: string, destAddress: string) => {
  const contract = new ethers.Contract(getContractAddress(swapAction.chainId), uniswapRouter02ABI)
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time

  if (USE_EXACT_IN) {
    // Exact In
    if (swapAction.token.id === ethers.constants.AddressZero) {
      const data = await contract.populateTransaction.swapExactETHForTokens(swapEstimate.toAmountMin, swapEstimate.data.path, destAddress, deadline)
      data.value = BigNumber.from(swapEstimate.fromAmount)
      return data
    } else if (swapAction.toToken.id === ethers.constants.AddressZero) {
      return await contract.populateTransaction.swapExactTokensForETH(swapEstimate.fromAmount, swapEstimate.toAmountMin, swapEstimate.data.path, destAddress, deadline)
    } else {
      return await contract.populateTransaction.swapExactTokensForTokens(swapEstimate.fromAmount, swapEstimate.toAmountMin, swapEstimate.data.path, destAddress, deadline)
    }
  } else {
    // Exact Out
    if (swapAction.token.id === ethers.constants.AddressZero) {
      const data = await contract.populateTransaction.swapETHForExactTokens(swapEstimate.toAmountMin, swapEstimate.data.path, destAddress, deadline)
      data.value = BigNumber.from(swapEstimate.fromAmount)
      return data
    } else if (swapAction.toToken.id === ethers.constants.AddressZero) {
      return await contract.populateTransaction.swapTokensForExactETH(swapEstimate.toAmountMin, swapEstimate.fromAmount, swapEstimate.data.path, destAddress, deadline)
    } else {
      return await contract.populateTransaction.swapTokensForExactTokens(swapEstimate.toAmountMin, swapEstimate.fromAmount, swapEstimate.data.path, destAddress, deadline)
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
        result.fromAmount = parsed.amount0In.isZero() ? parsed.amount1In.toString() : parsed.amount0In.toString()
      }
      result.toAmount = parsed.amount0Out.isZero() ? parsed.amount1Out.toString() : parsed.amount0Out.toString()
    } catch {
      // ignore, only matching will be parsed
    }
  })

  return result
}
