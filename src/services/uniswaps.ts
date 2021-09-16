import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'

const uniswapRouter02ABI = [
  "function swapExactTokensForTokens (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
]

const swappedTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "address",
    "name": "initiator",
    "type": "address"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "srcAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "receivedAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "expectedAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "string",
    "name": "referrer",
    "type": "string"
  }),
]
interface Swapped {
  initiator: string
  srcAmount: BigNumber
  receivedAmount: BigNumber
  expectedAmount: BigNumber
  referrer: string
}

// Official routers
const uniswapRouters: { [chainId: number]: string } = {
  // Uniswap https://app.uniswap.org/#/swap
  1: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", // router v2 https://uniswap.org/docs/v2/smart-contracts/router02/#address

  // BSC PancakeSwap https://docs.pancakeswap.finance/
  56: "0x05ff2b0db69458a0750badebc4f9e13add608c7f", // router v1 https://bscscan.com/address/0x05ff2b0db69458a0750badebc4f9e13add608c7f#contracts
  //56: "0x10ED43C718714eb63d5aA57B78B54704E256024E", // router v2 https://bscscan.com/address/0x10ED43C718714eb63d5aA57B78B54704E256024E#code

  // xDAI Honeyswap https://wiki.1hive.org/projects/honeyswap/honeyswap-on-xdai-1
  100: "0x1C232F01118CB8B424793ae03F870aa7D0ac7f77", // router v2 https://blockscout.com/poa/xdai/address/0x1C232F01118CB8B424793ae03F870aa7D0ac7f77/contracts

  // Polygon QuickSwap https://github.com/QuickSwap/QuickSwap-subgraph/blob/master/subgraph.yaml => Factory 0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32
  137: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", // router v2 https://explorer-mainnet.maticvigil.com/address/0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff/contracts

  //TESTNET
  //UNiswap Testnet Router v2
  3: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  4: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  5: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
}

export const getContractAddress = (chainId: number) => {
  return uniswapRouters[chainId]
}

export const swap = async (signer: JsonRpcSigner, chainId: number, destAddress: string, srcAmount: string, path: Array<string>) => {
  const contract = new ethers.Contract(getContractAddress(chainId), uniswapRouter02ABI, signer)

  const swapData = {
    amountIn: srcAmount,
    amountOutMin: '1', // TODO: maybe change this, but this will make the swap always succeed
    path,
    to: destAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now on -> https://docs.uniswap.org/sdk/2.0.0/guides/trading
  }
  const tx = await contract.swapExactTokensForTokens(swapData.amountIn, swapData.amountOutMin, swapData.path, swapData.to, swapData.deadline)
  return tx
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
  const log = receipt.logs.find((log) => log.address === receipt.to)
  if (log) {
    const parsed = decoder.decode(swappedTypes, log.data) as unknown as Swapped
    result.fromAmount = parsed.srcAmount.toString()
    result.toAmount = parsed.receivedAmount.toString()
  }

  return result
}
