import axios from 'axios'
import {JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber } from 'ethers'

const SUPPORTED_CHAINS = [1, 56, 137]
const baseURL =  'https://api.1inch.exchange/v3.0/'

// const RpcUrls = {
//   1: process.env.REACT_APP_RPC_URL_MAINNET,
//   56: process.env.REACT_APP_RPC_URL_BSC,
//   137: process.env.REACT_APP_RPC_URL_POLYGON,
// }

// const provider:{[key: number] : JsonRpcProvider | null} = {
//   1: new JsonRpcProvider(RpcUrls[1]),
//   56: new JsonRpcProvider(RpcUrls[56]),
//   137: new JsonRpcProvider(RpcUrls[137]),
// }

const setAllowance = async (chainId: number, amount:number, fromTokenAddress: string , signer: JsonRpcSigner ) => {
  const result = await axios.get(`https://api.1inch.exchange/v3.0/${chainId}/approve/calldata?amount=${amount}&infinity=true&tokenAddress=${checkTokenAddress(fromTokenAddress)}`)
  const allowance = result.data;
  delete allowance.gasPrice
  allowance.value = BigNumber.from(allowance.value)
  const approvedAllowance = await signer.sendTransaction(allowance)
  // wait for confirmation
  await approvedAllowance.wait(1)
  return approvedAllowance
}

const checkTokenAddress = (address:string ) =>{
  if (address === '0x0000000000000000000000000000000000000000'){
    return '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
  }
  return address
}


const getTransaction = async (chainId: number, fromTokenAddress: string, toTokenAddress: string, amount: number,fromAddress:string, destReceiver:string) => {
  // https://docs.1inch.io/api/quote-swap
  /* TODO: 1inch API supports custom gasPrices use transactionSpeed to get gasprice */
  /* TODO: slippage hardcoded to 1 */
  const params = {
    fromTokenAddress: checkTokenAddress(fromTokenAddress), //REQUIRED, string, contract address of a token to sell
    toTokenAddress: checkTokenAddress(toTokenAddress), // REQUIRED, string, contract address of a token to buy
    amount: amount, // REQUIRED, integer, amount of a token to sell
    fromAddress: fromAddress, // REQUIRED, string, address of a seller
    slippage: 1, // REQUIRED, number, additional slippage in percentage
    // protocols: // OPTIONAL, string, protocols that can be used in a swap
    destReceiver: destReceiver, // OPTIONAL, string, address that will receive a purchased token
    referrerAddress: process.env.REACT_APP_ONEINCH_REFERRER_WALLET,// OPTIONAL, string, referrer's address
    fee: process.env.REACT_APP_ONEINCH_FEE, // OPTIONAL, number, referrer's fee in percentage
    // gasPrice: // OPTIONAL, string, gas price
    // burnChi: // OPTIONAL, boolean, if true, CHI will be burned from fromAddress to compensate gas
    // complexityLevel: // OPTIONAL, string, how many connectorTokens can be used
    // connectorTokens: // OPTIONAL, string, contract addresses of connector tokens
    // allowPartialFill: // OPTIONAL, boolean, if true, accept the partial order execution
    // disableEstimate: // OPTIONAL, boolean, if true, checks of the required quantities are disabled
    // gasLimit: // OPTIONAL, integer, maximum amount of gas for a swap
    // parts: // OPTIONAL, integer, maximum number of parts each main route part can be split into
    // mainRouteParts: // OPTIONAL, integer, maximum number of main route parts
  }

  const result = await axios.get(`${baseURL}${chainId}/swap`, { params })
  //const result = await axios.get(`${baseURL}${chainId}/swap?fromTokenAddress=${checkTokenAddress(fromTokenAddress)}&toTokenAddress=${checkTokenAddress(toTokenAddress)}&amount=${amount}&slippage=1&fromAddress=${fromAddress}&destReceiver=${destReceiver}`)
  const toAmount: number = result.data.toTokenAmount? result.data.toTokenAmount : -1
  const path: Array<any> = result.data.protocols ? result.data.protocols[0].map((step:Array<any>) => step[0]) : []
  const tx = result.data.tx

  return {
    toAmount,
    path,
    tx
  }
}
const transfer = async (signer: JsonRpcSigner, chainId:number, fromTokenAddress: string, toTokenAddress: string, amount: number, destReceiver: string) => {
  const userAddress = await signer.getAddress()
  let oneInch = await getTransaction(chainId, fromTokenAddress, toTokenAddress, amount, userAddress, destReceiver);
  oneInch.tx.value = BigNumber.from(oneInch.tx.value)
  delete oneInch.tx.gas
  delete oneInch.tx.gasPrice
  return signer.sendTransaction(oneInch.tx)
}

const isChainSupported = (chainId: number) => {
  return SUPPORTED_CHAINS.indexOf(chainId) !== -1
}



export const oneInch = {isChainSupported, getTransaction, transfer, setAllowance}
