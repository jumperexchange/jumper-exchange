import { BigNumber } from 'ethers'
import { ChainKey, CoinKey } from './base.types'

export interface Chain {
  key: ChainKey
  name: string
  coin: CoinKey
  id: number
  visible: boolean
  exchange?: Exchange
  faucetUrls?: string[]
  metamask: AddEthereumChainParameter
}

export interface AddEthereumChainParameter {
  chainId: string;
  blockExplorerUrls: string[];
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
}

export interface Exchange {
  name: string
  webUrl: string
  graph: string
  tokenlistUrl: string
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

    exchange: {
      name: 'UniswapV2',
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

    exchange: {
      name: 'QuickSwap',
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

    exchange: {
      name: 'Pancake',
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

    exchange: {
      name: 'Honeyswap',
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

    // https://docs.fantom.foundation/tutorials/set-up-metamask
    metamask: {
      chainId: prefixChainId(250),
      blockExplorerUrls: [
        'https://ftmscan.com/',
      ],
      chainName: 'Fantom Opera',
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
  // 42161 - Arbitrum One
  {
    key: ChainKey.ARB,
    name: 'Arbitrum One',
    coin: CoinKey.ETH,
    id: 42161,
    visible: true,
    faucetUrls: [
      'https://bridge.arbitrum.io/'
    ],

    metamask: {
      chainId: prefixChainId(42161),
      blockExplorerUrls: [
        'https://arbiscan.io',
      ],
      chainName: 'Arbitrum One',
      nativeCurrency: {
        name: 'AETH',
        symbol: 'AETH',
        decimals: 18, // check
      },
      rpcUrls: [
        'https://arb1.arbitrum.io/rpc',
      ],
    }
  },

  // 128 - Huobi ECO Chain Mainnet
  {
    key: ChainKey.HEC,
    name: 'Huobi ECO Chain Mainnet',
    coin: 'HT' as CoinKey,
    id: 128,
    visible: true,
    faucetUrls: [

    ],

    metamask: {
      chainId: prefixChainId(128),
      blockExplorerUrls: [
        'https://hecoinfo.com',
      ],
      chainName: 'Huobi ECO Chain Mainnet',
      nativeCurrency: {
        name: 'HT',
        symbol: 'HT',
        decimals: 18,
      },
      rpcUrls: [
        'https://http-mainnet.hecochain.com',
      ],
    }
  },

  // 10 - Optimistic Ethereum
  {
    key: ChainKey.OPT,
    name: 'Optimistic Ethereum',
    coin: CoinKey.ETH,
    id: 10,
    visible: true,
    faucetUrls: [
      'https://gateway.optimism.io/'
    ],

    metamask: {
      chainId: prefixChainId(10),
      blockExplorerUrls: [
        'https://optimistic.etherscan.io',
      ],
      chainName: 'Optimistic Ethereum',
      nativeCurrency: {
        name: 'OETH',
        symbol: 'OETH',
        decimals: 18,
      },
      rpcUrls: [
        'https://mainnet.optimism.io/',
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

  // 256 - Huobi ECO Chain Testnet
  {
    key: ChainKey.HECT,
    name: 'Huobi ECO Chain Testnet',
    coin: 'HTT' as CoinKey,
    id: 256,
    visible: false,
    faucetUrls: [
      'https://scan-testnet.hecochain.com/faucet'
    ],

    metamask: {
      chainId: prefixChainId(256),
      blockExplorerUrls: [
        'https://scan-testnet.hecochain.com/',
      ],
      chainName: 'Huobi ECO Chain Testnet',
      nativeCurrency: {
        name: 'HT',
        symbol: 'HT',
        decimals: 18,
      },
      rpcUrls: [
        'https://http-testnet.hecochain.com',
        'wss://ws-testnet.hecochain.com',
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
