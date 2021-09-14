
import { createAndPushProcess, initStatus, setStatusDone, setStatusFailed } from './status'

import * as uniswap from './uniswaps'
import { JsonRpcProvider, JsonRpcSigner, } from '@ethersproject/providers'
import { Execution } from '../types/server'
import {ethers} from 'ethers'
import BigNumber from 'bignumber.js'


const chainJsonProviders: { [chainId: number]: JsonRpcProvider } = {
  1: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_MAINNET),
  56: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_BSC),
  100: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_XDAI),
  137: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_POLYGON_MAINNET),
  //TESTNET
  3: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_ROPSTEN),
  4: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_RINKEBY),
  5: new JsonRpcProvider(process.env.REACT_APP_RPC_URL_GORLI),

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

const uniswapRouter02ABI = [
  "function swapExactTokensForTokens (uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
]

const uniswapRouter02Contract: {[chainId: number]: ethers.Contract } = {
  1: new ethers.Contract(uniswapRouters[1], uniswapRouter02ABI, chainJsonProviders[1]),
  56: new ethers.Contract(uniswapRouters[56], uniswapRouter02ABI, chainJsonProviders[56]),
  100: new ethers.Contract(uniswapRouters[100], uniswapRouter02ABI, chainJsonProviders[100]),
  137: new ethers.Contract(uniswapRouters[137], uniswapRouter02ABI, chainJsonProviders[137]),

  //TESTNETS
  //uniswap
  3: new ethers.Contract(uniswapRouters[3], uniswapRouter02ABI, chainJsonProviders[3]),
  4: new ethers.Contract(uniswapRouters[4], uniswapRouter02ABI, chainJsonProviders[4]),
  5: new ethers.Contract(uniswapRouters[5], uniswapRouter02ABI, chainJsonProviders[5]),



}

export const executeUniswap = async (chainId: number, signer: JsonRpcSigner, srcToken: string, srcAmount: BigNumber, srcAddress: string, destAddress: string, path: Array<string>, updateStatus?: Function, initialStatus?: Execution) => {

  // setup
  const { status, update } = initStatus(updateStatus, initialStatus)
  const contractWithSigner = uniswapRouter02Contract[chainId].connect(signer);
  const swapData = {
    amountIn: srcAmount,
    amountOutMin: '1', // TODO: maybe change this, but this will make the swap always succeed
    path,
    to: destAddress,
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes from now on -> https://docs.uniswap.org/sdk/2.0.0/guides/trading
  }
  // Ask user to set allowance
  // -> set status
  const allowanceProcess = createAndPushProcess(update, status, 'Set Allowance')

  // -> check allowance
  try {
    await uniswap.setAllowance(signer, uniswapRouters[chainId], srcAddress, srcToken, srcAmount.toNumber())
  } catch (e:any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, allowanceProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, allowanceProcess)


  // Swap via Uniswap
  // -> set status
  const swapProcess = createAndPushProcess(update, status, 'Swap via Uniswap')

  // -> swapping
  let tx
  try {
    tx = await contractWithSigner.swapExactTokensForTokens(swapData.amountIn.toNumber(), swapData.amountOutMin, swapData.path, swapData.to, swapData.deadline)
  } catch (e: any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, swapProcess)
    throw e
  }

  // -> set status
  setStatusDone(update, status, swapProcess)


  // Wait for transaction
  // -> set status
  const waitingProcess = createAndPushProcess(update, status, 'Wait for Transaction')

  // -> waiting
  let receipt
  try {
    receipt = await tx.wait()
  } catch (e: any) {
    // -> set status
    if (e.message) allowanceProcess.errorMessage = e.message
    if (e.code) allowanceProcess.errorCode = e.code
    setStatusFailed(update, status, waitingProcess)
    throw e
  }

  // -> set status
  const parsedReceipt = uniswap.parseReceipt(tx, receipt)
  setStatusDone(update, status, waitingProcess, {
    fromAmount: parsedReceipt.fromAmount,
    toAmount: parsedReceipt.toAmount,
    gasUsed: (status.gasUsed || 0) + parsedReceipt.gasUsed,
  })

  // // -> set status
  status.status = 'DONE'
  update(status)

  // DONE
  return status
}
