import { ChainId, multicallAddresses } from '@lifinance/sdk'

import { chainIdToObject, deepClone } from '../services/utils'

const customRpc: Record<number, (string | undefined)[]> = {
  [ChainId.ETH]: [process.env.REACT_APP_RPC_URL_MAINNET],
  [ChainId.POL]: [process.env.REACT_APP_RPC_URL_POLYGON],
  [ChainId.BSC]: [process.env.REACT_APP_RPC_URL_BSC],
  [ChainId.DAI]: [process.env.REACT_APP_RPC_URL_XDAI],
  [ChainId.FTM]: [process.env.REACT_APP_RPC_URL_FANTOM],
  [ChainId.ARB]: [process.env.REACT_APP_RPC_URL_ARBITRUM],

  // Testnet
  [ChainId.ROP]: [process.env.REACT_APP_RPC_URL_ROPSTEN],
  [ChainId.RIN]: [process.env.REACT_APP_RPC_URL_RINKEBY],
  [ChainId.GOR]: [process.env.REACT_APP_RPC_URL_GORLI],
  [ChainId.KOV]: [process.env.REACT_APP_RPC_URL_KOVAN],
  [ChainId.ARBT]: [process.env.REACT_APP_RPC_URL_ARBITRUM_RINKEBY],
  [ChainId.OPTT]: [process.env.REACT_APP_RPC_URL_OPTIMISM_KOVAN],
  [ChainId.MUM]: [process.env.REACT_APP_RPC_URL_POLYGON_MUMBAI],
  [ChainId.BSCT]: [process.env.REACT_APP_RPC_URL_BSC_TESTNET],
}

export const getRpcs = (): Record<number, string[]> => {
  const rpcs = deepClone(customRpc)
  Object.keys(rpcs).forEach((key) => {
    if (!rpcs[key]) {
      delete rpcs[key]
    }
  })

  return rpcs
}

export const getMulticallAddresses = (): Record<ChainId, string | undefined> => {
  const object: Record<ChainId, string | undefined> = chainIdToObject(undefined)
  Object.values(ChainId).forEach((chainId) => {
    object[chainId as ChainId] = multicallAddresses[chainId as ChainId]
  })

  return object
}
