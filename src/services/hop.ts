/* eslint-disable max-params */
import { JsonRpcSigner, TransactionReceipt, TransactionResponse } from '@ethersproject/providers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { Token } from '@hop-protocol/sdk/dist/src/models'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

import { ChainId, ChainKey, CoinKey, getChainByKey } from '../types'

const receivedContractTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
    indexed: false,
    internalType: 'uint256',
    name: 'value',
    type: 'uint256',
  }),
]

const bondedContractTypes: Array<ethers.utils.ParamType> = [
  ethers.utils.ParamType.from({
    indexed: false,
    internalType: 'uint256',
    name: 'amount',
    type: 'uint256',
  }),
]
interface BondedSwapped {
  amount: BigNumber
}
interface ReceivedSwapped {
  value: BigNumber
}

let hop: Hop | undefined = undefined

let bridges: { [k: string]: HopBridge } = {}
const hopChains: { [k: number]: Chain } = {
  [getChainByKey(ChainKey.ETH).id]: Chain.Ethereum,
  [getChainByKey(ChainKey.POL).id]: Chain.Polygon,
  [getChainByKey(ChainKey.DAI).id]: Chain.xDai,
  [getChainByKey(ChainKey.OPT).id]: Chain.Optimism,
  [getChainByKey(ChainKey.ARB).id]: Chain.Arbitrum,

  // Testnet; Hop SDK changes the underlying id of these chains according to the instance network
  //network 'goerli'
  [getChainByKey(ChainKey.GOR).id]: Chain.Ethereum,
  [getChainByKey(ChainKey.MUM).id]: Chain.Polygon,
}

const supportedTestnetChains: number[] = [ChainId.GOR, ChainId.MUM]

// get these from https://github.com/hop-protocol/hop/blob/develop/packages/sdk/src/models/Token.ts
const hopTokens: { [k: string]: string } = {
  USDC: Token.USDC,
  USDT: Token.USDT,
  MATIC: Token.MATIC,
  DAI: Token.DAI,
}
const isInitialized = () => {
  if (hop === undefined) throw TypeError('Hop instance is undefined! Please initialize Hop')
}
const init = (signer: JsonRpcSigner, chainId: number, toChainId: number) => {
  const isChainTest = supportedTestnetChains.includes(chainId) ? true : false
  const isToChainTest = supportedTestnetChains.includes(toChainId) ? true : false
  // goerli <-> mumbai
  if (isChainTest && isToChainTest) {
    hop = new Hop('goerli')
  } else {
    hop = new Hop('mainnet')
  }
  bridges = {
    USDT: hop.connect(signer).bridge('USDT'),
    USDC: hop.connect(signer).bridge('USDC'),
    MATIC: hop.connect(signer).bridge('MATIC'),
    DAI: hop.connect(signer).bridge('DAI'),
  }
}

const getHopBridge = (bridgeCoin: CoinKey) => {
  isInitialized()
  if (!Object.keys(bridges).length) {
    throw Error(
      'No HopBridge available! Initialize Hop implementation first via init(signer: JsonRpcSigner, chainId: number, toChainId: number)',
    )
  }
  return bridges[bridgeCoin]
}

const setAllowanceAndCrossChains = async (
  bridgeCoin: CoinKey,
  amount: string,
  fromChainId: number,
  toChainId: number,
) => {
  isInitialized()
  const bridge = getHopBridge(bridgeCoin)
  const hopFromChain = hopChains[fromChainId]
  const hopToChain = hopChains[toChainId]
  const tx = await bridge.approveAndSend(amount, hopFromChain, hopToChain)
  return tx
}

const waitForDestinationChainReceipt = (
  tx: string,
  coin: CoinKey,
  fromChainId: number,
  toChainId: number,
): Promise<TransactionReceipt> => {
  return new Promise((resolve, reject) => {
    isInitialized()
    const hopFromChain = hopChains[fromChainId]
    const hopToChain = hopChains[toChainId]
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      hop
        ?.watch(tx, hopTokens[coin], hopFromChain, hopToChain)
        .once('destinationTxReceipt', async (data: any) => {
          const receipt: TransactionReceipt = data.receipt
          if (receipt.status !== 1) reject(receipt)
          if (receipt.status === 1) resolve(receipt)
        })
    } catch (e) {
      reject(e)
      throw e
    }
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
  const boondedLog = receipt.logs.find((log) => log.address === receipt.to) // info about initial funds
  const receivedLog = receipt.logs[2] // info about received funds
  if (boondedLog) {
    const parsed = decoder.decode(bondedContractTypes, boondedLog.data) as unknown as BondedSwapped
    result.fromAmount = parsed.amount.toString()
  }
  if (receivedLog) {
    const parsed = decoder.decode(
      receivedContractTypes,
      receivedLog.data,
    ) as unknown as ReceivedSwapped
    result.toAmount = parsed.value.toString()
  }
  return result
}

const hopExport = {
  init,
  setAllowanceAndCrossChains,
  waitForDestinationChainReceipt,
  parseReceipt,
}

export default hopExport
