import { ChainId } from '@lifi/sdk'

const load = (value?: string) => {
  return value ? value.split(',') : []
}

const customRpc: Record<number, (string | undefined)[]> = {
  [ChainId.ETH]: load(import.meta.env.VITE_RPC_URL_MAINNET),
  [ChainId.POL]: load(import.meta.env.VITE_RPC_URL_POLYGON),
  [ChainId.BSC]: load(import.meta.env.VITE_RPC_URL_BSC),
  [ChainId.DAI]: load(import.meta.env.VITE_RPC_URL_XDAI),
  [ChainId.FTM]: load(import.meta.env.VITE_RPC_URL_FANTOM),
  [ChainId.ARB]: load(import.meta.env.VITE_RPC_URL_ARBITRUM),
  [ChainId.OPT]: load(import.meta.env.VITE_RPC_URL_OPTIMISM),
  [ChainId.MOR]: load(import.meta.env.VITE_RPC_URL_MOONRIVER),
  [ChainId.ONE]: load(import.meta.env.VITE_RPC_URL_ONE),
  [ChainId.AUR]: load(import.meta.env.VITE_RPC_URL_AURORA),

  // Testnet
  [ChainId.ROP]: load(import.meta.env.VITE_RPC_URL_ROPSTEN),
  [ChainId.RIN]: load(import.meta.env.VITE_RPC_URL_RINKEBY),
  [ChainId.GOR]: load(import.meta.env.VITE_RPC_URL_GORLI),
  [ChainId.KOV]: load(import.meta.env.VITE_RPC_URL_KOVAN),
  [ChainId.ARBT]: load(import.meta.env.VITE_RPC_URL_ARBITRUM_RINKEBY),
  [ChainId.OPTT]: load(import.meta.env.VITE_RPC_URL_OPTIMISM_KOVAN),
  [ChainId.MUM]: load(import.meta.env.VITE_RPC_URL_POLYGON_MUMBAI),
  [ChainId.BSCT]: load(import.meta.env.VITE_RPC_URL_BSC_TESTNET),
}

export const getRpcs = (): Record<number, string[]> => {
  const rpcs = structuredClone(customRpc)
  Object.keys(rpcs).forEach((key) => {
    if (!rpcs[key] || !rpcs[key].length || !rpcs[key][0]) {
      delete rpcs[key]
    }
  })

  return rpcs as Record<number, string[]>
}
