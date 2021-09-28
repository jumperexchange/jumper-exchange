import axios from 'axios'
import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { BigNumber, ethers } from 'ethers'
import { Token } from '../types'

const SUPPORTED_CHAINS = [1, 56, 137]
const baseURL = 'https://api.1inch.exchange/v3.0/'

const swappedTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
    "indexed": false,
    "name": "sender",
    "type": "address"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "contract IERC20",
    "name": "srcToken",
    "type": "address"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "contract IERC20",
    "name": "dstToken",
    "type": "address"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "address",
    "name": "dstReceiver",
    "type": "address"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "spentAmount",
    "type": "uint256"
  }),
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "returnAmount",
    "type": "uint256"
  }),
]
interface Swapped {
  dstReceiver: string
  dstToken: string
  returnAmount: BigNumber
  sender: string
  spentAmount: BigNumber
  srcToken: string
}

const getContractAddress = async () => {
  const result = await axios.get(`https://api.1inch.exchange/v3.0/1/approve/spender`)
  return result.data.address
}

const checkTokenAddress = (address: string) => {
  if (address === '0x0000000000000000000000000000000000000000') {
    return '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  }
  return address
}


const getTransaction = async (chainId: number, fromTokenAddress: string, toTokenAddress: string, amount: string, fromAddress: string, destReceiver: string, slippage: number = 1) => {
  // https://docs.1inch.io/api/quote-swap
  /* TODO: 1inch API supports custom gasPrices use transactionSpeed to get gasprice */
  const params = {
    fromTokenAddress: checkTokenAddress(fromTokenAddress), //REQUIRED, string, contract address of a token to sell
    toTokenAddress: checkTokenAddress(toTokenAddress), // REQUIRED, string, contract address of a token to buy
    amount: amount, // REQUIRED, integer, amount of a token to sell
    fromAddress: fromAddress, // REQUIRED, string, address of a seller
    slippage: slippage, // REQUIRED, number, additional slippage in percentage
    // protocols: // OPTIONAL, string, protocols that can be used in a swap
    destReceiver: destReceiver, // OPTIONAL, string, address that will receive a purchased token
    referrerAddress: process.env.REACT_APP_ONEINCH_REFERRER_WALLET,// OPTIONAL, string, referrer's address
    fee: process.env.REACT_APP_ONEINCH_FEE, // OPTIONAL, number, referrer's fee in percentage
    // gasPrice: // OPTIONAL, string, gas price
    // burnChi: // OPTIONAL, boolean, if true, CHI will be burned from fromAddress to compensate gas
    // complexityLevel: // OPTIONAL, string, how many connectorTokens can be used
    // connectorTokens: // OPTIONAL, string, contract addresses of connector tokens
    // allowPartialFill: // OPTIONAL, boolean, if true, accept the partial order execution
    disableEstimate: true, // OPTIONAL, boolean, if true, checks of the required quantities are disabled
    // gasLimit: // OPTIONAL, integer, maximum amount of gas for a swap
    // parts: // OPTIONAL, integer, maximum number of parts each main route part can be split into
    // mainRouteParts: // OPTIONAL, integer, maximum number of main route parts
  }

  const result = await axios.get(`${baseURL}${chainId}/swap`, { params })
  const toAmount: number = result.data.toTokenAmount ? result.data.toTokenAmount : -1
  const path: Array<any> = result.data.protocols ? result.data.protocols[0].map((step: Array<any>) => step[0]) : []
  const tx = result.data.tx

  return {
    toAmount,
    path,
    tx
  }
}

const getSwapCall = async (chainId: number, destAddress: string, srcToken: Token, destToken: Token, srcAmount: string, slippage: number) => {
  const result = await getTransaction(chainId, srcToken.id, destToken.id, srcAmount, destAddress, destAddress, slippage)
  return {
    from: result.tx.from,
    to: result.tx.to,
    data: result.tx.data,
    value: BigNumber.from(result.tx.value),
    gasPrice: BigNumber.from(result.tx.gasPrice),
    gasLimit: BigNumber.from(result.tx.gas).mul(125).div(100), // add 25%
  } as ethers.PopulatedTransaction
}

const transfer = async (signer: JsonRpcSigner, chainId: number, fromTokenAddress: string, toTokenAddress: string, amount: string, destReceiver: string) => {
  const userAddress = await signer.getAddress()
  const result = await getTransaction(chainId, fromTokenAddress, toTokenAddress, amount, userAddress, destReceiver)

  const tx = {
    from: result.tx.from,
    to: result.tx.to,
    data: result.tx.data,
    value: BigNumber.from(result.tx.value),
    gasPrice: BigNumber.from(result.tx.gasPrice),
    gasLimit: BigNumber.from(result.tx.gas).mul(125).div(100), // add 25%
  }
  return signer.sendTransaction(tx)
}

const isChainSupported = (chainId: number) => {
  return SUPPORTED_CHAINS.indexOf(chainId) !== -1
}

const parseReceipt = (tx: TransactionResponse, receipt: TransactionReceipt) => {
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
    result.fromAmount = parsed.spentAmount.toString()
    result.toAmount = parsed.returnAmount.toString()
  }

  return result
}

export const oneInch = {
  isChainSupported,
  getSwapCall,
  getTransaction,
  transfer,
  getContractAddress,
  parseReceipt,
}
