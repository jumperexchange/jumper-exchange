import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { Token } from '@hop-protocol/sdk/dist/src/models'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { ChainKey, CoinKey } from '../types'
import { getChainByKey } from '../types/shared/chains.types'


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

const waitForReceipt = (tx:string, coin: CoinKey, fromChainId: number, toChainId:number) => {
  const hopFromChain = hopChains[fromChainId]
  const hopToChain = hopChains[toChainId]
  return new Promise ((resolve, reject) => {
    hop.watch(tx, hopTokens[coin], hopFromChain, hopToChain)
    .on('receipt', (data:any) => {
      const { receipt, chain } = data
      console.log(receipt, chain)
      resolve(receipt)
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


const hopExport = {
  init,
  setAllowanceAndCrossChains,
  waitForReceipt,
  parseReceipt
}

export default hopExport
