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

  const operationId = "a694bac1-be6ed76a-ccf2a0e3-f283c034"
  const operation = await bridgeSDK.api.getOperation(operationId)
  console.log(operation)
}

const harmony = {
  setupTestnet,
  setupMainnet,
  trigger,
}
export default harmony
