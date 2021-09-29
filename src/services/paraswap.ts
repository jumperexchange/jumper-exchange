import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import BN from 'bignumber.js'
import { BigNumber, ethers } from 'ethers'
import { NetworkID, ParaSwap, SwapSide } from 'paraswap'
import { Allowance, OptimalRatesWithPartnerFees, Transaction } from 'paraswap/build/types'

const instances: { [key: number]: ParaSwap | null } = {
  1: null,
  56: null,
  137: null,
  // testnet
  3: null, // ropsten
}

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

const getParaswap = (chainId: number) => {
  if (!instances[chainId]) {
    instances[chainId] = new ParaSwap(chainId as NetworkID).setWeb3Provider((window as any).ethereum)
  }
  return instances[chainId] as ParaSwap
}

export const getContractAddress = async (chainId: number) => {
  const para = getParaswap(chainId)
  return para.getSpender()
}

export const getAllowance = async (chainId: number, userAddress: string, tokenAddress: string) => {
  const para = getParaswap(chainId)
  const result = (await para.getAllowance(userAddress, tokenAddress)) as Allowance

  return parseInt(result.allowance)
}

export const setAllowance = async (signer: JsonRpcSigner, chainId: number, userAddress: string, tokenAddress: string, amount: number) => {
  const para = getParaswap(chainId)
  const txHash = await para.approveToken(amount.toString(), userAddress, tokenAddress);

  let res = null
  while (!res) {
    res = await signer.provider.getTransactionReceipt(txHash)
  }
  let newAllowance = await getAllowance(chainId, userAddress, tokenAddress)
  return newAllowance
}

export const updateAllowance = async (signer: JsonRpcSigner, chainId: number, userAddress: string, tokenAddress: string, amount: number) => {

  const allowance = await getAllowance(chainId, userAddress, tokenAddress)
  if (allowance === amount) {
    return allowance
  }

  // -> set allowance
  // if (allowance > 0) {
  //   await setAllowance(signer, chainId, userAddress, tokenAddress, 0)
  // }
  await setAllowance(signer, chainId, userAddress, tokenAddress, amount)
}

export const transfer = async (signer: JsonRpcSigner, chainId: number, userAddress: string, srcToken: string, destToken: string, srcAmount: string, receiver?: string, srcDecimals?: number, destDecimals?: number) => {
  const SLIPPAGE = 1 // =1%
  const para = getParaswap(chainId)

  const rate = await para.getRate(
    srcToken,
    destToken,
    srcAmount,
    SwapSide.SELL,
    {
      // excludeDEXS?: string;
      // includeDEXS?: string;
      // excludePools?: string;
      // excludePricingMethods?: PricingMethod[];
      // excludeContractMethods?: ContractMethod[];
      // includeContractMethods?: ContractMethod[];
      // adapterVersion?: string;
      referrer: process.env.REACT_APP_PARASWAP_REFERRER || 'paraswap.io',
      // maxImpact?: number;
      // maxUSDImpact?: number;
    },
    srcDecimals,
    destDecimals,
  ) as OptimalRatesWithPartnerFees

  const minAmount = new BN(rate.destAmount).times(1 - (SLIPPAGE / 100)).toFixed(0)
  const txParams = await para.buildTx(
    srcToken,
    destToken,
    srcAmount,
    minAmount,
    rate,
    userAddress,
    process.env.REACT_APP_PARASWAP_REFERRER || 'paraswap.io',
    receiver ?? userAddress,
    {},
    srcDecimals,
    destDecimals,
  ) as Transaction

  const transaction = {
    from: txParams.from,
    to: txParams.to,
    data: txParams.data,
    chainId: txParams.chainId,
  }
  return signer.sendTransaction(transaction)
}

export const parseReceipt = (tx: TransactionResponse, receipt: TransactionReceipt) => {
  const result = {
    fromAmount: '0',
    toAmount: '0',
    gasUsed: '0',
    gasPrice: '0',
    gasFee: '0',
  }

  // gas
  result.gasUsed = receipt.gasUsed.toString()
  result.gasPrice = tx.gasPrice?.toString() || '0'
  result.gasFee = receipt.gasUsed.mul(result.gasPrice).toString()

  // log
  console.log('LOGS', receipt.logs)
  const logs = receipt.logs.filter((log) => log.address === receipt.to)
  const decoder = new ethers.utils.AbiCoder()
  logs.forEach((log) => {
    try {
      const parsed = decoder.decode(swappedTypes, log.data) as unknown as Swapped
      result.fromAmount = parsed.srcAmount.toString()
      result.toAmount = parsed.receivedAmount.toString()
    } catch (e) {
      // find right log by trying to parse them
    }
  })

  return result
}
