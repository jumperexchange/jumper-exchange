import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';

const CHAINS = {
  MAINNET: 1,
  ROPSTEN: 3,
  RINKEBY: 4,
  KOVAN: 42,
  
  BSC: 56,
  // BSC_TESTNET: 97,

  POLYGON: 137,
  MUMBAI: 80001,

  XDAI: 100,
};

const RPC_URLS: { [chainId: number]: string } = {
  [CHAINS.MAINNET]: process.env.REACT_APP_RPC_URL_MAINNET as string,
  [CHAINS.ROPSTEN]: process.env.REACT_APP_RPC_URL_ROPSTEN as string,
  [CHAINS.RINKEBY]: process.env.REACT_APP_RPC_URL_RINKEBY as string,
  [CHAINS.KOVAN]: process.env.REACT_APP_RPC_URL_KOVAN as string,
  
  [CHAINS.BSC]: process.env.REACT_APP_RPC_URL_BSC as string,
  // [CHAINS.BSC_TESTNET]: process.env.REACT_APP_RPC_URL_BSC_TESTNET as string,
  
  [CHAINS.POLYGON]: process.env.REACT_APP_RPC_URL_POLYGON_MAINNET as string,
  [CHAINS.MUMBAI]: process.env.REACT_APP_RPC_URL_POLYGON_MUMBAI as string,

  [CHAINS.XDAI]: process.env.REACT_APP_RPC_URL_XDAI as string,
};

export const injected = new InjectedConnector({
  supportedChainIds: Object.values<number>(CHAINS),
});

export const network = new NetworkConnector({
  urls: Object.fromEntries(
    Object.values<number>(CHAINS).map(i => [i, RPC_URLS[i]])
  ),
  defaultChainId: CHAINS.MAINNET,
});
