import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { Token } from '@hop-protocol/sdk/dist/src/models'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { ChainKey, CoinKey } from '../types'
import { getChainByKey } from '../types/shared/chains.types'



const receivedContractTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
      "indexed": false,
      "internalType": "uint256",
      "name": "value",
      "type": "uint256"
    }),

]

const bondedContractTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }),
]
interface BondedSwapped {
  amount: BigNumber
}
interface ReceivedSwapped{
  value: BigNumber
}

const hop = new Hop('mainnet')
let bridges: {[k:string]: HopBridge} = {}
const hopChains : {[k:number]: Chain} = {
  [getChainByKey(ChainKey.ETH).id]: Chain.Ethereum,
  [getChainByKey(ChainKey.POL).id]: Chain.Polygon,
  [getChainByKey(ChainKey.DAI).id]: Chain.xDai,
}

// get these from https://github.com/hop-protocol/hop/blob/develop/packages/sdk/src/models/Token.ts
const hopTokens : {[k:string]: string} = {
  "USDC": Token.USDC,
  "USDT": Token.USDT,
  "MATIC": Token.MATIC,
}



const init = (signer: JsonRpcSigner) => {
  bridges = {
    "USDT": hop.connect(signer).bridge('USDC'),
    "USDC": hop.connect(signer).bridge('USDT'),
    "MATIC": hop.connect(signer).bridge('MATIC'),
  }
}

const getHopBridge = (bridgeCoin: CoinKey) => {
  if(!Object.keys(bridges).length){
    throw Error ('No HopBridge available! Initialize Hop implementation first via init(signer: JsonRpcSigner!)')
  }
  return bridges[bridgeCoin]
}

const setAllowanceAndCrossChains = async (bridgeCoin: CoinKey, amount: string, fromChainId: number, toChainId:number) => {
  const bridge = getHopBridge(bridgeCoin)
  const hopFromChain = hopChains[fromChainId]
  const hopToChain = hopChains[toChainId]
  const tx = await bridge.approveAndSend(amount, hopFromChain, hopToChain)
  return tx
}

const waitForDestinationChainReceipt = (tx:string, coin: CoinKey, fromChainId: number, toChainId:number): Promise<TransactionReceipt> => {
  return new Promise ((resolve, reject) => {
    const hopFromChain = hopChains[fromChainId]
    const hopToChain = hopChains[toChainId]
    hop.watch(tx, hopTokens[coin], hopFromChain, hopToChain)
    .once('destinationTxReceipt', async (data:any) => {
      const receipt: TransactionReceipt = data.receipt
      console.log(receipt)
      console.log("giving backo")
      if (receipt.status !== 1) reject(receipt)
      if (receipt.status === 1) resolve(receipt)
    })
  })
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
  console.log("before gas")
  result.gasUsed = receipt.gasUsed.toString()
  result.gasPrice = tx.gasPrice?.toString() || '0'
  result.gasFee = receipt.gasUsed.mul(result.gasPrice).toString()
  console.log(result)

  // log
  console.log("before log")
  const boondedLog = receipt.logs.find((log) => log.address === receipt.to) // info about initial funds
  const receivedLog = receipt.logs[2] // info about received funds
  if (boondedLog) {
    const parsed = decoder.decode(bondedContractTypes, boondedLog.data) as unknown as BondedSwapped
    result.fromAmount = parsed.amount.toString()
  }
  if(receivedLog){
    const parsed = decoder.decode(receivedContractTypes, receivedLog.data) as unknown as ReceivedSwapped
    result.toAmount = parsed.value.toString()
  }
  console.log(result)
  return result
}


const hopExport = {
  init,
  setAllowanceAndCrossChains,
  waitForDestinationChainReceipt,
  parseReceipt
}

export default hopExport
