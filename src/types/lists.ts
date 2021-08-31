import { BigNumber } from 'ethers';
import { ChainKey, Coin, CoinKey, Token } from '.';

import bsc from "../assets/icons/bsc.png";
import eth from "../assets/icons/ethereum.png";
import pancake from "../assets/icons/pancake.png";
import polygon from "../assets/icons/polygon.png";
import quick from "../assets/icons/quick.png";
import honey from "../assets/icons/honey.png";
import xdai from "../assets/icons/xdai.png";
import uniswap from "../assets/icons/uniswap.png";
import fantom from "../assets/icons/fantom.png";

export interface AddEthereumChainParameter {
  chainId: string;
  blockExplorerUrls: string[];
  chainName: string;
  iconUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
}

export interface Exchange {
  name: string
  iconUrl: string
  logoUrl: string
  webUrl: string
  graph: string
  tokenlistUrl: string
}

export interface Chain {
  key: ChainKey
  name: string
  coin: CoinKey
  id: number
  visible: boolean
  iconUrl?: string
  exchange?: Exchange
  faucetUrls?: string[]
  metamask: AddEthereumChainParameter
}

const prefixChainId = (chainId: number) => {
  return '0x' + BigNumber.from(chainId)._hex.split('0x')[1].replace(/\b0+/g, '')
}

// chainNames aligned with https://github.com/ethereum-lists/chains/tree/master/_data/chains
export const supportedChains: Array<Chain> = [
  // 1 - Ethereum
  {
    key: ChainKey.ETH,
    name: 'Ethereum',
    coin: CoinKey.ETH,
    id: 1,
    visible: true,
    iconUrl: eth,

    exchange: {
      name: 'UniswapV2',
      iconUrl: uniswap,
      logoUrl: '',
      webUrl: 'https://app.uniswap.org/#/swap',
      graph: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2', // https://thegraph.com/explorer/subgraph/uniswap/uniswap-v2
      tokenlistUrl: 'https://gateway.ipfs.io/ipns/tokens.uniswap.org',
    },

    metamask: {
      chainId: prefixChainId(1),
      blockExplorerUrls: [
        'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      ],
      chainName: 'Ethereum Mainnet',
      iconUrls: [],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://etherscan.io/',
      ],
    },
  },
  // 137 - Polygon
  {
    key: ChainKey.POL,
    name: 'Polygon',
    coin: CoinKey.MATIC,
    id: 137,
    visible: true,
    iconUrl: polygon,

    exchange: {
      name: 'QuickSwap',
      iconUrl: quick,
      logoUrl: 'https://quickswap.exchange/static/media/QuickSwap_logo.420e2e01.png',
      webUrl: 'https://quickswap.exchange/',
      graph: 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06', // https://thegraph.com/explorer/subgraph/sameepsi/quickswap06 (often new versions)
      tokenlistUrl: 'https://unpkg.com/quickswap-default-token-list@1.0.71/build/quickswap-default.tokenlist.json',
    },

    // https://docs.matic.network/docs/develop/metamask/config-matic/
    metamask: {
      chainId: prefixChainId(137),
      blockExplorerUrls: [
        'https://polygonscan.com/',
        'https://explorer-mainnet.maticvigil.com/',
      ],
      chainName: 'Matic(Polygon) Mainnet',
      iconUrls: [],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc-mainnet.maticvigil.com/',
      ],
    },
  },
  // 56 - Binance Smart Chain
  {
    key: ChainKey.BSC,
    name: 'BSC',
    coin: CoinKey.BNB,
    id: 56,
    visible: true,
    iconUrl: bsc,

    exchange: {
      name: 'Pancake',
      logoUrl: pancake,
      iconUrl: 'https://assets.trustwalletapp.com/blockchains/smartchain/assets/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82/logo.png',
      webUrl: 'https://exchange.pancakeswap.finance/',
      graph: 'https://api.thegraph.com/subgraphs/name/bscnodes/pancakeswap', // https://thegraph.com/explorer/subgraph/bscnodes/pancakeswap
      tokenlistUrl: 'https://tokens.pancakeswap.finance/pancakeswap-extended.json',
    },

    // https://docs.binance.org/smart-chain/wallet/metamask.html
    metamask: {
      chainId: prefixChainId(56),
      blockExplorerUrls: [
        'https://bscscan.com/',
      ],
      chainName: 'Binance Smart Chain Mainnet',
      iconUrls: [],
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [
        'https://bsc-dataseed.binance.org/',
        'https://bsc-dataseed1.defibit.io/',
        'https://bsc-dataseed1.ninicoin.io/',
      ],
    },
  },
  // 100 - xDai
  {
    key: ChainKey.DAI,
    name: 'xDai',
    coin: CoinKey.DAI,
    id: 100,
    visible: true,
    iconUrl: xdai,

    exchange: {
      name: 'Honeyswap',
      iconUrl: honey,
      logoUrl: 'https://app.honeyswap.org/static/media/wordmark_white.svg',
      webUrl: 'https://app.honeyswap.org/',
      graph: 'https://api.thegraph.com/subgraphs/name/1hive/honeyswap-xdai',
      tokenlistUrl: 'https://tokens.honeyswap.org/',
    },

    // https://www.xdaichain.com/for-users/wallets/metamask/metamask-setup
    metamask: {
      chainId: prefixChainId(100),
      blockExplorerUrls: [
        'https://blockscout.com/xdai/mainnet',
      ],
      chainName: 'xDAI Chain',
      iconUrls: [],
      nativeCurrency: {
        name: 'xDai',
        symbol: 'xDai',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.xdaichain.com/',
        'https://dai.poa.network/',
        'https://xdai.poanetwork.dev/',
        'https://xdai.1hive.org/',
      ],
    },
  },
  // 250 - Fantom
  {
    key: ChainKey.FTM,
    name: 'Fantom',
    coin: CoinKey.FTM,
    id: 250,
    visible: true,
    iconUrl: fantom,

    // https://docs.fantom.foundation/tutorials/set-up-metamask
    metamask: {
      chainId: prefixChainId(250),
      blockExplorerUrls: [
        'https://ftmscan.com/',
      ],
      chainName: 'Fantom Opera',
      iconUrls: [],
      nativeCurrency: {
        name: 'FTM',
        symbol: 'FTM',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc.ftm.tools/',
        'https://rpcapi.fantom.network',
      ],
    },
  },
  // 66 - OKExCHain
  {
    key: ChainKey.OKT,
    name: 'OKExCHain',
    coin: CoinKey.OKT,
    id: 66,
    visible: true,

    // https://okexchain-docs.readthedocs.io/en/latest/developers/quick-start-for-mainnet.html
    metamask: {
      chainId: prefixChainId(66),
      blockExplorerUrls: [
        'https://www.oklink.com/okexchain/',
      ],
      chainName: 'OKExChain Mainnet',
      iconUrls: [],
      nativeCurrency: {
        name: 'OKT',
        symbol: 'OKT',
        decimals: 18,
      },
      rpcUrls: [
        'https://exchainrpc.okex.org',
      ],
    },
  },
  // 43114 - Avalanche
  {
    key: ChainKey.AVA,
    name: 'Avalanche',
    coin: CoinKey.AVAX,
    id: 43114,
    visible: true,

    // https://support.avax.network/en/articles/4626956-how-do-i-set-up-metamask-on-avalanche
    metamask: {
      chainId: prefixChainId(43114),
      blockExplorerUrls: [
        'https://cchain.explorer.avax.network/',
      ],
      chainName: 'Avalanche Mainnet',
      iconUrls: [],
      nativeCurrency: {
        name: 'AVAX',
        symbol: 'AVAX',
        decimals: 18,
      },
      rpcUrls: [
        'https://api.avax.network/ext/bc/C/rpc',
      ],
    }
  },
  // 32659 - FSN-MAIN (anyswap)
  // {
  //   key: ChainKey.FSN,
  //   name: 'FSN-MAIN (anyswap)',
  //   coin: CoinKey.FSN,
  //   id: 32659,
  //   visible: false,

  //   // https://support.avax.network/en/articles/4626956-how-do-i-set-up-metamask-on-avalanche
  //   metamask: {
  //     chainId: prefixChainId(32659),
  //     blockExplorerUrls: [
  //       'https://fsnex.com',
  //     ],
  //     chainName: 'Fusion Mainnet',
  //     iconUrls: [],
  //     nativeCurrency: {
  //       name: 'FSN',
  //       symbol: 'FSN',
  //       decimals: 18,
  //     },
  //     rpcUrls: [
  //       'https://fsnmainnet2.anyswap.exchange',
  //     ],
  //   }
  // },

  // 1666600000 - Harmony Mainnet Shard 0
  // {
  //   key: ChainKey.HAR,
  //   name: 'Harmony Mainnet Shard 0',
  //   coin: CoinKey.HAR,
  //   id: 1666600000,
  //   visible: false,
  //   // https://docs.harmony.one/home/developers/wallets/metamask/connect-metamask-to-the-harmony-chain
  //   metamask: {
  //     chainId: prefixChainId(1666600000),
  //     blockExplorerUrls: [
  //       'https://www.harmony.one/',
  //     ],
  //     chainName: 'Harmony Mainnet Shard 0',
  //     iconUrls: [],
  //     nativeCurrency: {
  //       name: 'ONE',
  //       symbol: 'ONE',
  //       decimals: 18,
  //     },
  //     rpcUrls: [
  //       'https://api.harmony.one',
  //     ],
  //   }
  // },

  // TESTNETS
  // 3 - Ropsten
  {
    key: ChainKey.ROP,
    name: 'Ropsten',
    coin: CoinKey.ETH,
    id: 3,
    visible: false,
    faucetUrls: [
      'https://faucet.ropsten.be/',
    ],

    metamask: {
      chainId: prefixChainId(3),
      blockExplorerUrls: [
        'https://ropsten.etherscan.io/',
      ],
      chainName: 'Ethereum Testnet Ropsten',
      iconUrls: [],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://ropsten.infura.io/v3/d1caeba320f94122ba8f791f50122c4c',
      ],
    }
  },
  // 4 - Rinkeby
  {
    key: ChainKey.RIN,
    name: 'Rinkeby',
    coin: CoinKey.ETH,
    id: 4,
    visible: false,
    faucetUrls: [
      'https://faucet.rinkeby.io/',
    ],

    metamask: {
      chainId: prefixChainId(4),
      blockExplorerUrls: [
        'https://rinkeby.etherscan.io/',
      ],
      chainName: 'Ethereum Testnet Rinkeby',
      iconUrls: [],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://rinkeby.infura.io/v3/d1caeba320f94122ba8f791f50122c4c',
      ],
    }
  },
  // 5 - Goerli
  {
    key: ChainKey.GOR,
    name: 'Goerli',
    coin: CoinKey.ETH,
    id: 5,
    visible: false,
    faucetUrls: [
      'https://goerli-faucet.slock.it/',
    ],

    metamask: {
      chainId: prefixChainId(5),
      blockExplorerUrls: [
        'https://goerli.etherscan.io/',
      ],
      chainName: 'Ethereum Testnet Görli',
      iconUrls: [],
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://goerli.infura.io/v3/d1caeba320f94122ba8f791f50122c4c',
      ],
    }
  },

  // 80001 - Mumbai Polygon Testnet
  {
    key: ChainKey.MUM,
    name: 'Polygon Testnet',
    coin: CoinKey.MATIC,
    id: 80001,
    visible: false,
    faucetUrls: [
      'https://faucet.matic.network/',
    ],

    metamask: {
      chainId: prefixChainId(80001),
      blockExplorerUrls: [
        'https://explorer-mumbai.maticvigil.com/',
      ],
      chainName: 'Matic(Polygon) Testnet Mumbai',
      iconUrls: [],
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'tMATIC',
        decimals: 18,
      },
      rpcUrls: [
        'https://rpc-mumbai.matic.today',
      ],
    }
  },
  // 421611 - Arbitrum Testnet
  {
    key: ChainKey.ARBT,
    name: 'Arbitrum Testnet',
    coin: CoinKey.ETH,
    id: 421611,
    visible: false,
    faucetUrls: [
      'https://bridge.arbitrum.io/'
    ],

    metamask: {
      chainId: prefixChainId(421611),
      blockExplorerUrls: [
        'https://rinkeby-explorer.arbitrum.io/#/',
      ],
      chainName: 'Arbitrum Testnet Rinkeby',
      iconUrls: [],
      nativeCurrency: {
        name: 'ARETH',
        symbol: 'ARETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://rinkeby.arbitrum.io/rpc',
      ],
    }
  },
  // 69 - Optimistic Ethereum (Kovan)
  {
    key: ChainKey.OPTT,
    name: 'Optimism Testnet',
    coin: CoinKey.ETH,
    id: 69,
    visible: false,
    faucetUrls: [
      'https://gateway.optimism.io/'
    ],

    metamask: {
      chainId: prefixChainId(69),
      blockExplorerUrls: [
        'https://kovan-optimistic.etherscan.io',
      ],
      chainName: 'Optimistic Ethereum Testnet Kovan',
      iconUrls: [],
      nativeCurrency: {
        name: 'tETH',
        symbol: 'tETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://kovan.optimism.io',
      ],
    }
  },
  // 97 - Binance Smart Chain Testnet
  {
    key: ChainKey.BSCT,
    name: 'Binance Smart Chain Testnet',
    coin: CoinKey.BNB,
    id: 97,
    visible: false,
    faucetUrls: [
      'https://testnet.binance.org/faucet-smart'
    ],

    metamask: {
      chainId: prefixChainId(97),
      blockExplorerUrls: [
        'https://testnet.bscscan.com/',
      ],
      chainName: 'Binance Smart Chain Testnet',
      iconUrls: [],
      nativeCurrency: {
        name: 'tBNB',
        symbol: 'tBNB',
        decimals: 18,
      },
      rpcUrls: [
        'https://data-seed-prebsc-1-s1.binance.org:8545/',
      ],
    }
  },

  // https://faucet.buni.finance/
]

export const getChainByKey = (chainKey: ChainKey) => {
  const chain = supportedChains.find(chain => chain.key === chainKey)
  if (!chain) {
    throw new Error('Invalid chainKey')
  }
  return chain
}

export const getChainById = (chainId: number) => {
  const chain = supportedChains.find(chain => chain.id === chainId)
  if (!chain) {
    throw new Error('Invalid chainId')
  }
  return chain
}

export const defaultCoins: Array<Coin> = [
  // NATIVE COINS
  {
    key: CoinKey.ETH,
    name: CoinKey.ETH,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    chains: {
      [ChainKey.ETH]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: 1,
        chainKey: ChainKey.ETH,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: 56,
        chainKey: ChainKey.BSC,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.POL]: {
        id: '0xfd8ee443ab7be5b1522a1c020c097cff1ddc1209',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: 137,
        chainKey: ChainKey.POL,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0xa5c7cb68cd81640d40c85b2e5ec9e4bb55be0214',
        symbol: CoinKey.ETH,
        decimals: 18,
        chainId: 100,
        chainKey: ChainKey.DAI,
        key: CoinKey.ETH,
        name: CoinKey.ETH,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
      },
    },
  },
  {
    key: CoinKey.MATIC,
    name: CoinKey.MATIC,
    logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
    chains: {
      [ChainKey.ETH]: {
        id: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
        symbol: CoinKey.MATIC,
        decimals: 18,
        chainId: 1,
        chainKey: ChainKey.ETH,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
      [ChainKey.BSC]: {
        id: '0xa90cb47c72f2c7e4411e781772735d9317d08dd4',
        symbol: CoinKey.MATIC,
        decimals: 8,
        chainId: 56,
        chainKey: ChainKey.BSC,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
      [ChainKey.POL]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.MATIC,
        decimals: 18,
        chainId: 137,
        chainKey: ChainKey.POL,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
      [ChainKey.DAI]: {
        id: '0x7122d7661c4564b7c6cd4878b06766489a6028a2',
        symbol: CoinKey.MATIC,
        decimals: 18,
        chainId: 100,
        chainKey: ChainKey.DAI,
        key: CoinKey.MATIC,
        name: CoinKey.MATIC,
        logoURI: 'https://etherscan.io/token/images/matictoken_28.png',
      },
    },
  },
  {
    key: CoinKey.BNB,
    name: CoinKey.BNB,
    logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
    chains: {
      [ChainKey.ETH]: {
        id: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: 1,
        chainKey: ChainKey.ETH,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
      [ChainKey.BSC]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: 56,
        chainKey: ChainKey.BSC,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
      [ChainKey.POL]: {
        id: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: 137,
        chainKey: ChainKey.POL,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
      [ChainKey.DAI]: {
        id: '0xca8d20f3e0144a72c6b5d576e9bd3fd8557e2b04',
        symbol: CoinKey.BNB,
        decimals: 18,
        chainId: 100,
        chainKey: ChainKey.DAI,
        key: CoinKey.BNB,
        name: CoinKey.BNB,
        logoURI: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
      },
    },
  },
  {
    key: CoinKey.DAI,
    name: CoinKey.DAI,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    chains: {
      [ChainKey.ETH]: {
        id: '0x6b175474e89094c44da98b954eedeac495271d0f',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: 1,
        chainKey: ChainKey.ETH,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: 56,
        chainKey: ChainKey.BSC,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.POL]: {
        id: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: 137,
        chainKey: ChainKey.POL,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0x0000000000000000000000000000000000000000',
        symbol: CoinKey.DAI,
        decimals: 18,
        chainId: 100,
        chainKey: ChainKey.DAI,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
      [ChainKey.FTM]: {
        id: '0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e',
        symbol: CoinKey.DAI,
        decimals: 18, // TODO: check
        chainId: 100,
        chainKey: ChainKey.FTM,
        key: CoinKey.DAI,
        name: CoinKey.DAI,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
      },
    },
  },


  // OTHER STABLECOINS
  {
    key: CoinKey.USDT,
    name: CoinKey.USDT,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    chains: {
      [ChainKey.ETH]: {
        id: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: 1,
        chainKey: ChainKey.ETH,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x55d398326f99059ff775485246999027b3197955',
        symbol: CoinKey.USDT,
        decimals: 18,
        chainId: 56,
        chainKey: ChainKey.BSC,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.POL]: {
        id: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: 137,
        chainKey: ChainKey.POL,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0x4ecaba5870353805a9f068101a40e0f32ed605c6',
        symbol: CoinKey.USDT,
        decimals: 6,
        chainId: 100,
        chainKey: ChainKey.DAI,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
      [ChainKey.FTM]: {
        id: '0x049d68029688eabf473097a2fc38ef61633a3c7a',
        symbol: CoinKey.USDT,
        decimals: 6, // TODO: check
        chainId: 100,
        chainKey: ChainKey.FTM,
        key: CoinKey.USDT,
        name: CoinKey.USDT,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
      },
    },
  },
  {
    key: CoinKey.USDC,
    name: CoinKey.USDC,
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    chains: {
      [ChainKey.ETH]: {
        id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: 1,
        chainKey: ChainKey.ETH,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.BSC]: {
        id: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
        symbol: CoinKey.USDC,
        decimals: 18,
        chainId: 56,
        chainKey: ChainKey.BSC,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.POL]: {
        id: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: 137,
        chainKey: ChainKey.POL,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.DAI]: {
        id: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83',
        symbol: CoinKey.USDC,
        decimals: 6,
        chainId: 100,
        chainKey: ChainKey.DAI,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
      [ChainKey.FTM]: {
        id: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
        symbol: CoinKey.USDC,
        decimals: 6, // Check
        chainId: 250,
        chainKey: ChainKey.FTM,
        key: CoinKey.USDC,
        name: CoinKey.USDC,
        logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
      },
    },
  },
]

export const findDefaultCoin = (coinKey: CoinKey) => {
  const coin = defaultCoins.find(coin => coin.key === coinKey)
  if (!coin) {
    throw new Error('Invalid Coin')
  }
  return coin
}

export const defaultTokens: { [ChainKey: string]: Array<Token> } = {
  [ChainKey.ETH]: [
    findDefaultCoin(CoinKey.ETH).chains[ChainKey.ETH],
    findDefaultCoin(CoinKey.USDC).chains[ChainKey.ETH],
    findDefaultCoin(CoinKey.USDT).chains[ChainKey.ETH],
    findDefaultCoin(CoinKey.DAI).chains[ChainKey.ETH],
  ],
  [ChainKey.BSC]: [
    findDefaultCoin(CoinKey.USDC).chains[ChainKey.BSC],
    findDefaultCoin(CoinKey.USDT).chains[ChainKey.BSC],
    findDefaultCoin(CoinKey.DAI).chains[ChainKey.BSC],
  ],
  [ChainKey.POL]: [
    findDefaultCoin(CoinKey.USDC).chains[ChainKey.POL],
    findDefaultCoin(CoinKey.USDT).chains[ChainKey.POL],
    findDefaultCoin(CoinKey.DAI).chains[ChainKey.POL],
  ],
  [ChainKey.DAI]: [
    findDefaultCoin(CoinKey.USDC).chains[ChainKey.DAI],
    findDefaultCoin(CoinKey.USDT).chains[ChainKey.DAI],
    findDefaultCoin(CoinKey.DAI).chains[ChainKey.DAI],
  ],
  [ChainKey.FTM]: [
    findDefaultCoin(CoinKey.USDC).chains[ChainKey.FTM],
    findDefaultCoin(CoinKey.USDT).chains[ChainKey.FTM],
    findDefaultCoin(CoinKey.DAI).chains[ChainKey.FTM],
  ],
}

export const wrappedTokens: { [ChainKey: string]: Token } = {
  [ChainKey.ETH]: {
    // https://ww7.etherscan.io/token/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    symbol: 'WETH',
    decimals: 18,
    chainId: 1,
    chainKey: ChainKey.ETH,
    key: 'WETH' as CoinKey,
    name: 'WETH',
    logoURI: 'https://zapper.fi/images/networks/ethereum/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.BSC]: {
    // https://bscscan.com/token/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
    id: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    symbol: 'WBNB',
    decimals: 18,
    chainId: 56,
    chainKey: ChainKey.BSC,
    key: 'WBNB' as CoinKey,
    name: 'WBNB',
    logoURI: 'https://zapper.fi/images/networks/binance-smart-chain/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.POL]: {
    // https://polygonscan.com/token/0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270
    id: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    symbol: 'WMATIC',
    decimals: 18,
    chainId: 137,
    chainKey: ChainKey.POL,
    key: 'WMATIC' as CoinKey,
    name: 'WMATIC',
    logoURI: 'https://zapper.fi/images/networks/polygon/0x0000000000000000000000000000000000000000.png',
  },
  [ChainKey.DAI]: {
    // https://blockscout.com/xdai/mainnet/address/0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d
    id: '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d',
    symbol: 'WXDAI',
    decimals: 18,
    chainId: 100,
    chainKey: ChainKey.DAI,
    key: 'WXDAI' as CoinKey,
    name: 'WXDAI',
    logoURI: 'https://zapper.fi/images/networks/ethereum/0x6b175474e89094c44da98b954eedeac495271d0f.png',
  },
}
