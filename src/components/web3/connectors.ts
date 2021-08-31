import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { providers } from 'ethers';

const CHAINS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  GOERLI: 5,
  KOVAN: 42,
  ARBITRUM_RINKEBY: 421611,
  OPTIMISM_KOVAN: 69,

  BSC: 56,
  BSC_TESTNET: 97,

  POLYGON: 137,
  POLYGON_TESTNET: 80001,

  XDAI: 100,

  FANTOM: 250,
  OKEX: 66,
  AVALANCHE: 43114,
  FSN: 32659,
  HARMONY: 1666600000,
};

const RPC_URLS: { [chainId: number]: string } = {
  [CHAINS.MAINNET]: process.env.REACT_APP_RPC_URL_MAINNET as string,
  [CHAINS.ROPSTEN]: process.env.REACT_APP_RPC_URL_ROPSTEN as string,
  [CHAINS.RINKEBY]: process.env.REACT_APP_RPC_URL_RINKEBY as string,
  [CHAINS.GOERLI]: process.env.REACT_APP_RPC_URL_GORLI as string,
  [CHAINS.KOVAN]: process.env.REACT_APP_RPC_URL_KOVAN as string,
  [CHAINS.ARBITRUM_RINKEBY]: process.env.REACT_APP_RPC_URL_ARBITRUM_RINKEBY as string,
  [CHAINS.OPTIMISM_KOVAN]: process.env.REACT_APP_RPC_URL_OPTIMISM_KOVAN as string,

  [CHAINS.BSC]: process.env.REACT_APP_RPC_URL_BSC as string,
  [CHAINS.BSC_TESTNET]: process.env.REACT_APP_RPC_URL_BSC_TESTNET as string,

  [CHAINS.POLYGON]: process.env.REACT_APP_RPC_URL_POLYGON_MAINNET as string,
  [CHAINS.POLYGON_TESTNET]: process.env.REACT_APP_RPC_URL_POLYGON_MUMBAI as string,

  [CHAINS.XDAI]: process.env.REACT_APP_RPC_URL_XDAI as string,

  [CHAINS.FANTOM]: 'https://rpc.ftm.tools',
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
});

export const network = new NetworkConnector({
  urls: Object.fromEntries(
    Object.values<number>(CHAINS).map(i => [i, RPC_URLS[i]])
  ),
  defaultChainId: CHAINS.MAINNET,
});
