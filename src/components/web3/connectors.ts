import { InjectedConnector } from '@web3-react/injected-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { providers } from 'ethers'

import { ChainId, getChainById } from '../../types'

const CHAINS = {
  // Mainnet
  MAINNET: 1,
  POLYGON: 137,
  BSC: 56,
  XDAI: 100,
  FANTOM: 250,
  ARBITRUM: 42161,

  // Testnet
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  ARBITRUM_RINKEBY: 421611,
  OPTIMISM_KOVAN: 69,
  POLYGON_TESTNET: 80001,
  BSC_TESTNET: 97,

  // Additional
  OKEX: 66,
  AVALANCHE: 43114,
  FSN: 32659,
  KOV: ChainId.KOV,
  ONE: ChainId.ONE,
  ONET: ChainId.ONET,
}

const RPC_URLS: { [chainId: number]: string } = {
  // Mainnet
  [CHAINS.MAINNET]:
    process.env.REACT_APP_RPC_URL_MAINNET || getChainById(CHAINS.MAINNET).metamask.rpcUrls[0],
  [CHAINS.POLYGON]:
    process.env.REACT_APP_RPC_URL_POLYGON || getChainById(CHAINS.POLYGON).metamask.rpcUrls[0],
  [CHAINS.BSC]: process.env.REACT_APP_RPC_URL_BSC || getChainById(CHAINS.BSC).metamask.rpcUrls[0],
  [CHAINS.XDAI]:
    process.env.REACT_APP_RPC_URL_XDAI || getChainById(CHAINS.XDAI).metamask.rpcUrls[0],
  [CHAINS.FANTOM]:
    process.env.REACT_APP_RPC_URL_FANTOM || getChainById(CHAINS.FANTOM).metamask.rpcUrls[0],
  [CHAINS.ARBITRUM]:
    process.env.REACT_APP_RPC_URL_ARBITRUM || getChainById(CHAINS.ARBITRUM).metamask.rpcUrls[0],

  // Testnet
  [CHAINS.ROPSTEN]:
    process.env.REACT_APP_RPC_URL_ROPSTEN || getChainById(CHAINS.ROPSTEN).metamask.rpcUrls[0],
  [CHAINS.RINKEBY]:
    process.env.REACT_APP_RPC_URL_RINKEBY || getChainById(CHAINS.RINKEBY).metamask.rpcUrls[0],
  [CHAINS.GOERLI]:
    process.env.REACT_APP_RPC_URL_GORLI || getChainById(CHAINS.GOERLI).metamask.rpcUrls[0],
  [CHAINS.KOVAN]:
    process.env.REACT_APP_RPC_URL_KOVAN || getChainById(CHAINS.KOVAN).metamask.rpcUrls[0],
  [CHAINS.ARBITRUM_RINKEBY]:
    process.env.REACT_APP_RPC_URL_ARBITRUM_RINKEBY ||
    getChainById(CHAINS.ARBITRUM_RINKEBY).metamask.rpcUrls[0],
  [CHAINS.OPTIMISM_KOVAN]:
    process.env.REACT_APP_RPC_URL_OPTIMISM_KOVAN ||
    getChainById(CHAINS.OPTIMISM_KOVAN).metamask.rpcUrls[0],
  [CHAINS.POLYGON_TESTNET]:
    process.env.REACT_APP_RPC_URL_POLYGON_MUMBAI ||
    getChainById(CHAINS.POLYGON_TESTNET).metamask.rpcUrls[0],
  [CHAINS.BSC_TESTNET]:
    process.env.REACT_APP_RPC_URL_BSC_TESTNET ||
    getChainById(CHAINS.BSC_TESTNET).metamask.rpcUrls[0],

  // Additional
  [CHAINS.OKEX]: 'https://exchainrpc.okex.org',
  [CHAINS.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [CHAINS.FSN]: 'https://fsnmainnet2.anyswap.exchange',
  [CHAINS.KOV]: 'https://kovan.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  [CHAINS.ONE]: 'https://api.harmony.one',
  [CHAINS.ONET]: 'https://api.s0.b.hmny.io',
}

const MULTICALL_ADDRESSES: { [chainId: number]: string } = {
  // Mainnet
  [CHAINS.MAINNET]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [CHAINS.POLYGON]: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
  [CHAINS.BSC]: '0xa9193376D09C7f31283C54e56D013fCF370Cd9D9',
  [CHAINS.XDAI]: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
  [CHAINS.FANTOM]: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
  [CHAINS.ARBITRUM]: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
  [CHAINS.OKEX]: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
  [CHAINS.AVALANCHE]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
  [CHAINS.FSN]: '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F',
  [CHAINS.KOV]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [CHAINS.ONE]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',

  // Testnet
  [CHAINS.ROPSTEN]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [CHAINS.RINKEBY]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [CHAINS.GOERLI]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [CHAINS.KOVAN]: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
  [CHAINS.ARBITRUM_RINKEBY]: '0xa501c031958F579dB7676fF1CE78AD305794d579',
  [CHAINS.OPTIMISM_KOVAN]: '',
  [CHAINS.POLYGON_TESTNET]: '0xc1400d49baa8e307B4462cD46E0a20109D25F50f',
  [CHAINS.BSC_TESTNET]: '0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C',
  [CHAINS.ONET]: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
}

// cached providers
const chainProviders: Record<number, providers.FallbackProvider> = {}

export const getRpcUrls = (chainIds: Array<number>) => {
  const rpcs: Record<number, string> = {}
  chainIds.forEach((chainId) => {
    rpcs[chainId] = RPC_URLS[chainId]
  })
  return rpcs
}

export const getMulticallAddresses = (chainIds: Array<number>) => {
  const addresses: Record<number, string> = {}
  chainIds.forEach((chainId) => {
    addresses[chainId] = MULTICALL_ADDRESSES[chainId]
  })
  return addresses
}

export const getRpcProvider = (chainId: number) => {
  if (!chainProviders[chainId]) {
    chainProviders[chainId] = new providers.FallbackProvider([
      new providers.JsonRpcProvider(RPC_URLS[chainId], chainId),
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

export const injected = new InjectedConnector({
  supportedChainIds: Object.values<number>(CHAINS),
})

export const network = new NetworkConnector({
  urls: Object.fromEntries(Object.values<number>(CHAINS).map((i) => [i, RPC_URLS[i]])),
  defaultChainId: CHAINS.MAINNET,
})
