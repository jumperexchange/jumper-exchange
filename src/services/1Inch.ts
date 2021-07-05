import axios from 'axios'
import { JsonRpcSigner, JsonRpcProvider, UrlJsonRpcProvider } from '@ethersproject/providers'
import { BigNumber, Transaction, Wallet } from 'ethers'
import { StringDecoder } from 'string_decoder'

const SUPPORTED_CHAINS = [1, 56, 137]
const baseURL =  'https://api.1inch.exchange/v3.0/'

const RpcUrls = {
  1: process.env.REACT_APP_RPC_URL_MAINNET,
  56: process.env.REACT_APP_RPC_URL_BSC,
  137: process.env.REACT_APP_RPC_URL_POLYGON_MAINNET,
}

const provider:{[key: number] : JsonRpcProvider | null} = {
  1: new JsonRpcProvider(RpcUrls[1]),
  56: new JsonRpcProvider(RpcUrls[56]),
  137: new JsonRpcProvider(RpcUrls[137]),
}

const getSignerForChain = async (chainId: number, amount:number, fromTokenAddress: string , userAddress: string | null | undefined) => {
  const result = await axios.get(`https://api.1inch.exchange/v3.0/1/approve/calldata?tokenAddress=${checkTokenAddress(fromTokenAddress)}`)
  const allowance = result.data;
  delete allowance.gasPrice;
  console.log(allowance)
  // const signer = provider[chainId]?.getSigner(userAddress as string) as JsonRpcSigner;
  const wallet = new Wallet(userAddress as string, provider[chainId] as JsonRpcProvider);
  const data = await wallet.sendTransaction(allowance)
  console.log(data)
  return wallet

}

const checkTokenAddress = (address:string ) =>{
  if (address === '0x0000000000000000000000000000000000000000'){
    return '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  }
  return address
}


const getTransaction = async (chainId: number, fromTokenAddress: string, toTokenAddress: string, amount: number,fromAddress:string, destReceiver:string) => {
/* TODO: 1inch API supports custom gasPrices
use transactionSpeed to get gasprice
*/

/* TODO: slippage hardcoded to 1 */

  const result = await axios.get(`${baseURL}${chainId}/swap?fromTokenAddress=${checkTokenAddress(fromTokenAddress)}&toTokenAddress=${checkTokenAddress(toTokenAddress)}&amount=${amount}&slippage=1&fromAddress=${fromAddress}&destReceiver=${destReceiver}`)
  const toAmount: number = result.data.toTokenAmount? result.data.toTokenAmount : -1
  const path: Array<any> = result.data.protocols ? result.data.protocols[0].map((step:Array<any>) => step[0]) : []
  const tx = result.data.tx

  return {
    toAmount,
    path,
    tx
  }
}
const transfer = async (wallet: Wallet, chainId:number, fromTokenAddress: string, toTokenAddress: string, amount: number, destReceiver: string) => {
  let oneInch = await getTransaction(chainId, fromTokenAddress, toTokenAddress, amount, wallet.address, destReceiver);
  (window as any).ethereum.enable()
  console.log(oneInch)
  // oneInch gives back estimated gasLimit as gas. ethers transaction needs key gasLimit. 25% increase as per documentation
  oneInch.tx.gasLimit = BigNumber.from(Math.round( oneInch.tx.gas * 0.25 ));
  oneInch.tx.gasPrice = BigNumber.from(oneInch.tx.gasPrice)
  oneInch.tx.value = BigNumber.from(oneInch.tx.value)
  delete oneInch.tx.gas
  // const transaction = await signer.populateTransaction(  )
  // const signedTransaction = await signer.signTransaction(transaction)

  return wallet.sendTransaction(oneInch.tx)
}

const isChainSupported = (chainId: number) => {
  return SUPPORTED_CHAINS.indexOf(chainId) !== -1
}



export const oneInch = {isChainSupported, getTransaction, transfer, getSignerForChain}
