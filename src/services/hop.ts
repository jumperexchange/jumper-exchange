import { JsonRpcSigner } from '@ethersproject/providers'
import { Chain, Hop, HopBridge } from '@hop-protocol/sdk'
import { ChainKey, CoinKey } from '../types'
import { getChainByKey } from '../types/lists'


const hop = new Hop('mainnet')


let bridges: {[k:string]: HopBridge} = {}

const hopChains : {[k:number]: Chain} = {
  [getChainByKey(ChainKey.ETH).id]: Chain.Ethereum,
  [getChainByKey(ChainKey.POL).id]: Chain.Polygon,
  [getChainByKey(ChainKey.DAI).id]: Chain.xDai,
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
  const tx = await bridge.approveAndSend('1000000000000000000', hopFromChain, hopToChain)
  return tx
}


export default {
  init,
  setAllowanceAndCrossChains
}
