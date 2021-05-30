import { ethers } from "ethers";
import { ChainKey, CoinKey } from '../types';
import erc20_abi from './ABI/ERC_20.json';

const RpcUrls = {
  [ChainKey.ETH]: process.env.REACT_APP_RPC_URL_MAINNET,
  [ChainKey.BSC]: process.env.REACT_APP_RPC_URL_BSC,
  [ChainKey.POL]: process.env.REACT_APP_RPC_URL_POLYGON_MAINNET,
  [ChainKey.DAI]: process.env.REACT_APP_RPC_URL_XDAI,
}

const provider = {
  [ChainKey.ETH]: new ethers.providers.JsonRpcProvider(RpcUrls[ChainKey.ETH]),
  [ChainKey.BSC]: new ethers.providers.JsonRpcProvider(RpcUrls[ChainKey.BSC]),
  [ChainKey.POL]: new ethers.providers.JsonRpcProvider(RpcUrls[ChainKey.POL]),
  [ChainKey.DAI]: new ethers.providers.JsonRpcProvider(RpcUrls[ChainKey.DAI]),
}

const nativeTokenMapping = {
  [CoinKey.ETH]: {
    nativeChain: ChainKey.ETH,
  },
  [CoinKey.BNB]: {
    nativeChain: ChainKey.BSC,
  },
  [CoinKey.MATIC]: {
    nativeChain: ChainKey.POL,
  },
  [CoinKey.DAI]: {
    nativeChain: ChainKey.DAI,
  },
}

//logic: token -> provider for each chain
const availableTokens = {
  [CoinKey.ETH]: {
    [ChainKey.BSC]: new ethers.Contract('0x2170ed0880ac9a755fd29b2688956bd959f933f8', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.POL]: new ethers.Contract('0xfD8ee443ab7BE5b1522a1C020C097CFF1ddC1209', erc20_abi, provider[ChainKey.POL]),
    [ChainKey.DAI]: new ethers.Contract('0xa5c7cb68cd81640D40c85b2e5Ec9E4Bb55Be0214', erc20_abi, provider[ChainKey.DAI]),
  },
  [CoinKey.BNB]: {
    [ChainKey.ETH]: new ethers.Contract('0xB8c77482e45F1F44dE1745F52C74426C631bDD52', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.POL]: new ethers.Contract('0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F', erc20_abi, provider[ChainKey.POL]),
    [ChainKey.DAI]: new ethers.Contract('0xCa8d20f3e0144a72C6B5d576e9Bd3Fd8557E2B04', erc20_abi, provider[ChainKey.DAI]), // xdai explorer says wbnb 0xCa8d20f3e0144a72C6B5d576e9Bd3Fd8557E2B04
  },
  [CoinKey.MATIC]: {
    [ChainKey.ETH]: new ethers.Contract('0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.BSC]: new ethers.Contract('0xa90cb47c72f2c7e4411e781772735d9317d08dd4', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.DAI]: new ethers.Contract('0x7122d7661c4564b7C6Cd4878B06766489a6028A2', erc20_abi, provider[ChainKey.DAI])
  },
  [CoinKey.DAI]: {
    [ChainKey.ETH]: new ethers.Contract('0x6b175474e89094c44da98b954eedeac495271d0f', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.BSC]: new ethers.Contract('0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.POL]: new ethers.Contract('0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', erc20_abi, provider[ChainKey.POL]),
  },
}

function getListOfSupportedTokens() {
  return Object.keys(availableTokens)
}

async function getTokenBalance(coinKey: CoinKey, walletAdress: string) {
  if (!getListOfSupportedTokens().includes(coinKey)) {
    console.error(`CoinKey ${coinKey} is not supported`)
    return null
  }

  var balanceAcrossChains: { [k: string]: number } = {}

  // get native/base chain token balance
  const nativeChain = nativeTokenMapping[coinKey].nativeChain
  if (nativeChain) {
    const nativeBalance = await provider[nativeChain].getBalance(walletAdress)
    balanceAcrossChains[nativeChain] = parseFloat(ethers.utils.formatEther(nativeBalance))
  }

  // get token on other chains
  const chains = availableTokens[coinKey];
  for (const [chain, contract] of Object.entries(chains)) {
    const externalBalance = await contract.balanceOf(walletAdress);
    balanceAcrossChains[chain] = parseFloat(ethers.utils.formatEther(externalBalance))
  }

  return balanceAcrossChains
}

async function getTokenBalanceFor(coinKeys: Array<CoinKey>, walletAdress: string) {
  var balances: { [k: string]: object } = {}
  for (const coinKey of coinKeys) {
    balances[coinKey] = getTokenBalance(coinKey, walletAdress)
  }

  return balances
}

export { getTokenBalance, getTokenBalanceFor, getListOfSupportedTokens };


