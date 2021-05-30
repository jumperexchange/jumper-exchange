import { ethers } from "ethers";
import { ChainKey, CoinKey } from '../types';
import erc20_abi from './ABI/ERC_20.json';

// add usdt, usdc, Cake, Bunny and many more

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

const nativeTokenMapping: {[k: string]: {[k: string]: ChainKey}} = {
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
    [ChainKey.DAI]: new ethers.Contract('0xCa8d20f3e0144a72C6B5d576e9Bd3Fd8557E2B04', erc20_abi, provider[ChainKey.DAI]), 
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
  [CoinKey.USDT]: {
    [ChainKey.ETH]: new ethers.Contract('0xdac17f958d2ee523a2206206994597c13d831ec7', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.BSC]: new ethers.Contract('0x55d398326f99059ff775485246999027b3197955', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.POL]: new ethers.Contract('0xc2132D05D31c914a87C6611C10748AEb04B58e8F', erc20_abi, provider[ChainKey.POL]),
    [ChainKey.DAI]: new ethers.Contract('0x4ECaBa5870353805a9F068101A40E0f32ed605C6', erc20_abi, provider[ChainKey.DAI])
  },
  [CoinKey.USDC]: {
    [ChainKey.ETH]: new ethers.Contract('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.BSC]: new ethers.Contract('0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.POL]: new ethers.Contract('0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', erc20_abi, provider[ChainKey.POL]),
    [ChainKey.DAI]: new ethers.Contract('0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', erc20_abi, provider[ChainKey.DAI])
  },
  [CoinKey.LINK]: {
    [ChainKey.ETH]: new ethers.Contract('0x514910771af9ca656af840dff83e8264ecf986ca', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.BSC]: new ethers.Contract('0xf8a0bf9cf54bb92f17374d9e9a321e6a111a51bd', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.POL]: new ethers.Contract('0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39', erc20_abi, provider[ChainKey.POL]),
    [ChainKey.DAI]: new ethers.Contract('0xE2e73A1c69ecF83F464EFCE6A5be353a37cA09b2', erc20_abi, provider[ChainKey.DAI])
  },
  [CoinKey.UNI]: {
    [ChainKey.ETH]: new ethers.Contract('0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.BSC]: new ethers.Contract('0xbf5140a22578168fd562dccf235e5d43a02ce9b1', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.POL]: new ethers.Contract('0xb33EaAd8d922B1083446DC23f610c2567fB5180f', erc20_abi, provider[ChainKey.POL]),
    [ChainKey.DAI]: new ethers.Contract('0x4537e328Bf7e4eFA29D05CAeA260D7fE26af9D74', erc20_abi, provider[ChainKey.DAI])
  },
  [CoinKey.AAVE]: {
    [ChainKey.ETH]: new ethers.Contract('0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', erc20_abi, provider[ChainKey.ETH]),
    [ChainKey.BSC]: new ethers.Contract('0xfb6115445bff7b52feb98650c87f44907e58f802', erc20_abi, provider[ChainKey.BSC]),
    [ChainKey.POL]: new ethers.Contract('0xd6df932a45c0f255f85145f286ea0b292b21c90b', erc20_abi, provider[ChainKey.POL]),
    [ChainKey.DAI]: new ethers.Contract('0xDF613aF6B44a31299E48131e9347F034347E2F00', erc20_abi, provider[ChainKey.DAI])
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
  if(nativeTokenMapping.hasOwnProperty(coinKey)){
    const nativeChain = nativeTokenMapping[coinKey].nativeChain
    if (nativeChain) {
      const nativeBalance = await provider[nativeChain].getBalance(walletAdress)
      balanceAcrossChains[nativeChain] = parseFloat(ethers.utils.formatEther(nativeBalance))
    }
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

