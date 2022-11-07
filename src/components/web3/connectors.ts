import { providers } from 'ethers'

import { ChainId, getChainById } from '../../types'

const customRpc: Record<number, string | undefined> = {
  [ChainId.ETH]: import.meta.env.VITE_RPC_URL_MAINNET
    ? import.meta.env.VITE_RPC_URL_MAINNET.split(',')[0]
    : undefined,
  [ChainId.POL]: import.meta.env.VITE_RPC_URL_POLYGON,
  [ChainId.BSC]: import.meta.env.VITE_RPC_URL_BSC,
  [ChainId.DAI]: import.meta.env.VITE_RPC_URL_XDAI,
  [ChainId.FTM]: import.meta.env.VITE_RPC_URL_FANTOM,
  [ChainId.ARB]: import.meta.env.VITE_RPC_URL_ARBITRUM,
  [ChainId.OPT]: import.meta.env.VITE_RPC_URL_OPTIMISM,
  [ChainId.MOR]: import.meta.env.VITE_RPC_URL_MOONRIVER,
  [ChainId.ONE]: import.meta.env.VITE_RPC_URL_ONE,
  [ChainId.AUR]: import.meta.env.VITE_RPC_URL_AURORA,

  // Testnet
  [ChainId.ROP]: import.meta.env.VITE_RPC_URL_ROPSTEN,
  [ChainId.RIN]: import.meta.env.VITE_RPC_URL_RINKEBY,
  [ChainId.GOR]: import.meta.env.VITE_RPC_URL_GORLI,
  [ChainId.KOV]: import.meta.env.VITE_RPC_URL_KOVAN,
  [ChainId.ARBT]: import.meta.env.VITE_RPC_URL_ARBITRUM_RINKEBY,
  [ChainId.OPTT]: import.meta.env.VITE_RPC_URL_OPTIMISM_KOVAN,
  [ChainId.MUM]: import.meta.env.VITE_RPC_URL_POLYGON_MUMBAI,
  [ChainId.BSCT]: import.meta.env.VITE_RPC_URL_BSC_TESTNET,
}

// cached providers
const chainProviders: Record<number, providers.FallbackProvider> = {}

export const getRpcUrl = (chainId: number) => {
  return customRpc[chainId] || getChainById(chainId).metamask.rpcUrls[0]
}

export const getRpcProvider = (chainId: number) => {
  if (!chainProviders[chainId]) {
    chainProviders[chainId] = new providers.FallbackProvider([
      new providers.JsonRpcProvider(getRpcUrl(chainId), chainId),
    ])
  }
  return chainProviders[chainId]
}

export const getRpcProviders = (chainIds: Array<number>) => {
  const selectedProviders: Record<number, providers.FallbackProvider> = {}
  chainIds.forEach((chainId) => {
    selectedProviders[chainId] = getRpcProvider(chainId)
  })
  return selectedProviders
}

export const getRpcUrls = (chainIds: Array<number>) => {
  const selectedProviders: Record<number, string[]> = {}
  chainIds.forEach((chainId) => {
    selectedProviders[chainId] = [getRpcUrl(chainId)]
  })
  return selectedProviders
}
