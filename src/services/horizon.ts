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

const trigger = async () => {
  const bridgeSDK = await setupTestnet()

  const operationId = "4fb574b1-551616db-dd38a66d-52c9bd9f"
  const operation = await bridgeSDK.api.getOperation(operationId)
  console.log(operation)
}

const harmony = {
  setupTestnet,
  setupMainnet,
  trigger,
}
export default harmony
