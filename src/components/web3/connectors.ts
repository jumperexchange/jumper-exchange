import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { providers } from 'ethers';
import { getChainById } from '../../types/lists';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

const CHAINS = {
  // Mainnet
  MAINNET: 1,
  POLYGON: 137,
  BSC: 56,
  XDAI: 100,
  FANTOM: 250,

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
  HARMONY: 1666600000,
};

const RPC_URLS: { [chainId: number]: string } = {
  // Mainnet
  [CHAINS.MAINNET]: process.env.REACT_APP_RPC_URL_MAINNET || getChainById(CHAINS.MAINNET).metamask.rpcUrls[0],
  [CHAINS.POLYGON]: process.env.REACT_APP_RPC_URL_POLYGON || getChainById(CHAINS.POLYGON).metamask.rpcUrls[0],
  [CHAINS.BSC]: process.env.REACT_APP_RPC_URL_BSC || getChainById(CHAINS.BSC).metamask.rpcUrls[0],
  [CHAINS.XDAI]: process.env.REACT_APP_RPC_URL_XDAI || getChainById(CHAINS.XDAI).metamask.rpcUrls[0],
  [CHAINS.FANTOM]: process.env.REACT_APP_RPC_URL_FANTOM || getChainById(CHAINS.FANTOM).metamask.rpcUrls[0],

  // Testnet
  [CHAINS.ROPSTEN]: process.env.REACT_APP_RPC_URL_ROPSTEN || getChainById(CHAINS.ROPSTEN).metamask.rpcUrls[0],
  [CHAINS.RINKEBY]: process.env.REACT_APP_RPC_URL_RINKEBY || getChainById(CHAINS.RINKEBY).metamask.rpcUrls[0],
  [CHAINS.GOERLI]: process.env.REACT_APP_RPC_URL_GORLI || getChainById(CHAINS.GOERLI).metamask.rpcUrls[0],
  [CHAINS.KOVAN]: process.env.REACT_APP_RPC_URL_KOVAN || getChainById(CHAINS.KOVAN).metamask.rpcUrls[0],
  [CHAINS.ARBITRUM_RINKEBY]: process.env.REACT_APP_RPC_URL_ARBITRUM_RINKEBY || getChainById(CHAINS.ARBITRUM_RINKEBY).metamask.rpcUrls[0],
  [CHAINS.OPTIMISM_KOVAN]: process.env.REACT_APP_RPC_URL_OPTIMISM_KOVAN || getChainById(CHAINS.OPTIMISM_KOVAN).metamask.rpcUrls[0],
  [CHAINS.POLYGON_TESTNET]: process.env.REACT_APP_RPC_URL_POLYGON_MUMBAI || getChainById(CHAINS.POLYGON_TESTNET).metamask.rpcUrls[0],
  [CHAINS.BSC_TESTNET]: process.env.REACT_APP_RPC_URL_BSC_TESTNET || getChainById(CHAINS.BSC_TESTNET).metamask.rpcUrls[0],

  // Additional
  [CHAINS.OKEX]: 'https://exchainrpc.okex.org',
  [CHAINS.AVALANCHE]: 'https://api.avax.network/ext/bc/C/rpc',
  [CHAINS.FSN]: 'https://fsnmainnet2.anyswap.exchange',
  [CHAINS.HARMONY]: 'https://api.harmony.one',
};



// cached providers
const chainProviders: Record<number, providers.FallbackProvider> = {};

export const getRpcUrls = (chainIds: Array<number>) => {
  const rpcs : Record<number, string> = {}
  chainIds.forEach((chainId) => {
    rpcs[chainId] = RPC_URLS[chainId]
  })
  return rpcs
}

export const getRpcProviders = (chainIds: Array<number>) => {
  const selectedProviders: Record<number, providers.FallbackProvider> = {};

  chainIds.forEach((chainId) => {
    if (!chainProviders[chainId]) {
      chainProviders[chainId] = new providers.FallbackProvider([new providers.JsonRpcProvider(RPC_URLS[chainId], chainId)])
    }
    selectedProviders[chainId] = chainProviders[chainId]
  })

  return selectedProviders
}

export const injected = new InjectedConnector({
  supportedChainIds: Object.values<number>(CHAINS),
})

export const network = new NetworkConnector({
  urls: Object.fromEntries(
    Object.values<number>(CHAINS).map(i => [i, RPC_URLS[i]])
  ),
  defaultChainId: CHAINS.POLYGON,
})

export const walletConnectConnector = new WalletConnectConnector({
  rpc: Object.fromEntries(
    Object.values<number>(CHAINS).map(i => [i, RPC_URLS[i]])
  ),
})
