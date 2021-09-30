import { BridgeSDK } from 'bridge-sdk'
import * as configs from 'bridge-sdk/lib/configs'

const setupTestnet = async () => {
  const bridgeSDK = new BridgeSDK({ logLevel: 1 })
  await bridgeSDK.init(configs.testnet)
  bridgeSDK.setUseMetamask(true)
  return bridgeSDK
}

const setupMainnet = async () => {
  const bridgeSDK = new BridgeSDK({ logLevel: 1 })
  await bridgeSDK.init(configs.mainnet)
  bridgeSDK.setUseMetamask(true)
  return bridgeSDK
}

const harmony = {
  setupTestnet,
  setupMainnet,
}
export default harmony
