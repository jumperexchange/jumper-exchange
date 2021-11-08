import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { providers } from 'ethers'
import { ChainId, getChainById, supportedChains } from '../../types'

const customRpc: Record<number, string | undefined> = {
  [ChainId.ETH]: process.env.REACT_APP_RPC_URL_MAINNET,
  [ChainId.POL]: process.env.REACT_APP_RPC_URL_POLYGON,
  [ChainId.BSC]: process.env.REACT_APP_RPC_URL_BSC,
  [ChainId.DAI]: process.env.REACT_APP_RPC_URL_XDAI,
  [ChainId.FTM]: process.env.REACT_APP_RPC_URL_FANTOM,
  [ChainId.ARB]: process.env.REACT_APP_RPC_URL_ARBITRUM,

  // Testnet
  [ChainId.ROP]: process.env.REACT_APP_RPC_URL_ROPSTEN,
  [ChainId.RIN]: process.env.REACT_APP_RPC_URL_RINKEBY,
  [ChainId.GOR]: process.env.REACT_APP_RPC_URL_GORLI,
  [ChainId.KOV]: process.env.REACT_APP_RPC_URL_KOVAN,
  [ChainId.ARBT]: process.env.REACT_APP_RPC_URL_ARBITRUM_RINKEBY,
  [ChainId.OPTT]: process.env.REACT_APP_RPC_URL_OPTIMISM_KOVAN,
  [ChainId.MUM]: process.env.REACT_APP_RPC_URL_POLYGON_MUMBAI,
  [ChainId.BSCT]: process.env.REACT_APP_RPC_URL_BSC_TESTNET,
}

// based on:
// - https://github.com/sushiswap/sushiswap-sdk/blob/canary/src/constants/addresses.ts#L323
// - https://github.com/joshstevens19/ethereum-multicall#multicall-contracts
const MULTICALL_ADDRESSES: { [chainId: number]: string } = {
  // Mainnet
  [ChainId.ETH]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.POL]: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  [ChainId.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  [ChainId.DAI]: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  [ChainId.FTM]: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
  [ChainId.ARB]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [ChainId.OKT]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
  [ChainId.AVA]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.FSN]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [ChainId.KOV]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.ONE]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [ChainId.OPT]: '',

  // Testnet
  [ChainId.ROP]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.RIN]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.GOR]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.KOV]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [ChainId.ARBT]: '0xa501c031958F579dB7676fF1CE78AD305794d579',
  // [ChainId.OPTT]: '',
  [ChainId.MUM]: '0xc1400d49baa8e307B4462cD46E0a20109D25F50f',
  [ChainId.BSCT]: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
  // [ChainId.ONET]:  '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
}

// cached providers
const chainProviders: Record<number, providers.FallbackProvider> = {}

export const getRpcUrl = (chainId: number) => {
  return customRpc[chainId] || getChainById(chainId).metamask.rpcUrls[0]
}

export const getMulticallAddresse = (chainId: number) => {
  return MULTICALL_ADDRESSES[chainId]
}

export const getMulticallAddresses = (chainIds: Array<number>) => {
  const addresses: Record<number, string> = {}
  chainIds.forEach((chainId) => {
    addresses[chainId] = getMulticallAddresse(chainId)
  })
  return addresses
}

export const getRpcProvider = (chainId: number) => {
  if (!chainProviders[chainId]) {
    chainProviders[chainId] = new providers.FallbackProvider(
      [
        new providers.JsonRpcProvider(getRpcUrl(chainId), chainId)
      ]
    )
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

export const injected = new InjectedConnector({
  supportedChainIds: supportedChains.map(chain => chain.id),
})

export const network = new NetworkConnector({
  urls: Object.fromEntries(
    supportedChains.map(chain => chain.id).map(chainId => [chainId, getRpcUrl(chainId)])
  ),
  defaultChainId: ChainId.ETH,
})
