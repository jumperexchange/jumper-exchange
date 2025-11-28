import type { DefiPosition } from 'src/types/jumper-backend';
import type { MinimalToken } from 'src/types/tokens';

const ethereumChain = {
  chainId: 1,
  chainKey: 'ethereum' as const,
};

const baseChain = {
  chainId: 8453,
  chainKey: 'base' as const,
};

const tokenAddresses = {
  ETH: '0x0000000000000000000000000000000000000000',
  USDC_ETHEREUM: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDC_BASE: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDd86a3D015C766',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
};

export const tokens: MinimalToken[] = [
  {
    address: tokenAddresses.ETH,
    chain: ethereumChain,
    symbol: 'ETH',
    balance: 5.25,
    totalPriceUSD: 18562.5,
  },
  {
    address: tokenAddresses.USDC_ETHEREUM,
    chain: ethereumChain,
    symbol: 'USDC',
    balance: 2.5,
    totalPriceUSD: 8625.3,
    relatedTokens: [
      {
        address: tokenAddresses.USDC_BASE,
        chain: baseChain,
        symbol: 'USDC',
        balance: 1.0,
        totalPriceUSD: 3450.12,
      },
    ],
  },
  {
    address: tokenAddresses.USDT,
    chain: ethereumChain,
    symbol: 'USDT',
    balance: 1.8,
    totalPriceUSD: 6210.24,
  },
  {
    address: tokenAddresses.WBTC,
    chain: ethereumChain,
    symbol: 'WBTC',
    balance: 0.15,
    totalPriceUSD: 9847.5,
  },
  {
    address: tokenAddresses.DAI,
    chain: ethereumChain,
    symbol: 'DAI',
    balance: 3.2,
    totalPriceUSD: 3211.84,
  },
];

export const aavePositions: DefiPosition[] = [
  {
    name: 'Aave V3',
    assetUsd: 1.0017831783178317,
    debtUsd: 0,
    netUsd: 1.0017831783178317,
    address: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
    chain: {
      chainId: 42161,
      chainKey: 'arb',
    },
    type: 'Lending',
    openedAt: '2024-10-15T12:30:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '850000000',
      tvlNative: '850000000',
      apy: {
        base: 2.8,
        reward: 0.5,
        total: 3.3,
      },
    },
    protocol: {
      name: 'Aave V3',
      logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
      url: 'https://app.aave.com',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '1001683',
        amountUSD: 1.0017831783178317,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logo: 'https://static.debank.com/image/arb_token/logo_url/0xaf88d065e77c8cc2239327c5edb3a432268e5831/fffcd27b9efff5a86ab942084c05924d.png',
        address: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
        chain: {
          chainId: 42161,
          chainKey: 'arb',
        },
        priceUSD: 1.000100010001,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
  {
    name: 'Aave V3',
    assetUsd: 7.04781961968e-9,
    debtUsd: 1,
    netUsd: -0.99999999295218038,
    address: '0xa238dd80c259a72e81d7e4664a9801593f98d1c5',
    chain: {
      chainId: 8453,
      chainKey: 'base',
    },
    type: 'Lending',
    openedAt: '2024-09-20T08:15:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '850000000',
      tvlNative: '245000',
      apy: {
        base: 2.8,
        reward: 0.5,
        total: 3.3,
      },
    },
    protocol: {
      name: 'Aave V3',
      logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
      url: 'https://app.aave.com',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '2330844',
        amountUSD: 7.04781961968e-9,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        logo: 'https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png',
        address: '0x4200000000000000000000000000000000000006',
        chain: {
          chainId: 8453,
          chainKey: 'base',
        },
        priceUSD: 3023.72,
      },
    ],
    borrowTokens: [
      {
        chainType: 'EVM',
        amount: '2330844',
        amountUSD: 1,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        logo: 'https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png',
        address: '0x4200000000000000000000000000000000000006',
        chain: {
          chainId: 8453,
          chainKey: 'base',
        },
        priceUSD: 3023.72,
      },
    ],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

export const morphoPositions: DefiPosition[] = [
  {
    name: 'Morpho',
    assetUsd: 0.33359629049812184,
    debtUsd: 0,
    netUsd: 0.33359629049812184,
    address: '0xc5e7ab07030305fc925175b25b93b285d40dcdff',
    chain: {
      chainId: 747474,
      chainKey: 'katana',
    },
    type: 'Yield',
    openedAt: '2024-11-05T14:20:00.000Z',
    unlockAt: '2025-05-05T14:20:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '125000000',
      tvlNative: '125000000',
      apy: {
        base: 8.5,
        reward: 0,
        total: 8.5,
      },
    },
    protocol: {
      name: 'Morpho',
      logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
      url: 'https://app.morpho.org',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '110304925916365',
        amountUSD: 0.33359629049812184,
        name: 'Vault Bridge ETH',
        symbol: 'vbETH',
        decimals: 18,
        logo: 'https://static.debank.com/image/katana_token/logo_url/katana/48bfb74adddd170e936578aec422836d.png',
        address: '0xee7d8bcfb72bc1880d0cf19822eb0a2e6577ab62',
        chain: {
          chainId: 747474,
          chainKey: 'katana',
        },
        priceUSD: 3024.31,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
  {
    name: 'Morpho',
    assetUsd: 5.931475,
    debtUsd: 0,
    netUsd: 5.931475,
    address: '0xce2b8e464fc7b5e58710c24b7e5ebfb6027f29d7',
    chain: {
      chainId: 747474,
      chainKey: 'katana',
    },
    type: 'Yield',
    openedAt: '2024-08-12T10:45:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '125000000',
      tvlNative: '125000000',
      apy: {
        base: 7.2,
        reward: 0,
        total: 7.2,
      },
    },
    protocol: {
      name: 'Morpho',
      logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
      url: 'https://app.morpho.org',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '5931475',
        amountUSD: 5.931475,
        name: 'Vault Bridge USDC',
        symbol: 'vbUSDC',
        decimals: 6,
        logo: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
        address: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
        chain: {
          chainId: 747474,
          chainKey: 'katana',
        },
        priceUSD: 1,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
  {
    name: 'Morpho',
    assetUsd: 119.705551,
    debtUsd: 0,
    netUsd: 119.705551,
    address: '0xe4248e2105508fcbad3fe95691551d1af14015f7',
    chain: {
      chainId: 747474,
      chainKey: 'katana',
    },
    type: 'Yield',
    openedAt: '2024-07-22T16:30:00.000Z',
    unlockAt: '2025-01-22T16:30:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '125000000',
      tvlNative: '125000000',
      apy: {
        base: 9.1,
        reward: 0,
        total: 9.1,
      },
    },
    protocol: {
      name: 'Morpho',
      logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
      url: 'https://app.morpho.org',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '119705551',
        amountUSD: 119.705551,
        name: 'Vault Bridge USDC',
        symbol: 'vbUSDC',
        decimals: 6,
        logo: 'https://static.debank.com/image/coin/logo_url/usdc/e87790bfe0b3f2ea855dc29069b38818.png',
        address: '0x203a662b0bd271a6ed5a60edfbd04bfce608fd36',
        chain: {
          chainId: 747474,
          chainKey: 'katana',
        },
        priceUSD: 1,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
  {
    name: 'Morpho',
    assetUsd: 10.65361505075361,
    debtUsd: 0,
    netUsd: 10.65361505075361,
    address: '0xfade0c546f44e33c134c4036207b314ac643dc2e',
    chain: {
      chainId: 747474,
      chainKey: 'katana',
    },
    type: 'Yield',
    openedAt: '2024-06-01T09:00:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '125000000',
      tvlNative: '125000000',
      apy: {
        base: 6.8,
        reward: 1.2,
        total: 8.0,
      },
    },
    protocol: {
      name: 'Morpho',
      logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
      url: 'https://app.morpho.org',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '3522659730898489',
        amountUSD: 10.65361505075361,
        name: 'Vault Bridge ETH',
        symbol: 'vbETH',
        decimals: 18,
        logo: 'https://static.debank.com/image/katana_token/logo_url/katana/48bfb74adddd170e936578aec422836d.png',
        address: '0xee7d8bcfb72bc1880d0cf19822eb0a2e6577ab62',
        chain: {
          chainId: 747474,
          chainKey: 'katana',
        },
        priceUSD: 3024.31,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

export const hyperwavePositions: DefiPosition[] = [
  {
    name: 'Hyperwave',
    assetUsd: 17.148273267639563,
    debtUsd: 0,
    netUsd: 17.148273267639563,
    address: '0x4de03ca1f02591b717495cfa19913ad56a2f5858',
    chain: {
      chainId: 999,
      chainKey: 'hyper',
    },
    type: 'Yield',
    protocol: {
      name: 'Hyperwave',
      logo: 'https://static.debank.com/image/project/logo_url/hyper_hyperwavefi/13f0393f633a2a1fe6e709bd9c37d514.png',
      url: 'https://app.hyperwavefi.xyz',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '484921337772235520',
        amountUSD: 17.148273267639563,
        name: 'Wrapped HYPE',
        symbol: 'WHYPE',
        decimals: 18,
        logo: 'https://static.debank.com/image/hyper_token/logo_url/0x5555555555555555555555555555555555555555/752e760ec0b1a17b81c7535e09e76ef8.png',
        address: '0x5555555555555555555555555555555555555555',
        chain: {
          chainId: 999,
          chainKey: 'hyper',
        },
        priceUSD: 35.363,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

export const merklPositions: DefiPosition[] = [
  {
    name: 'Merkl',
    assetUsd: 0.03301631879858625,
    debtUsd: 0,
    netUsd: 0.03301631879858625,
    address: '0x3ef3d8ba38ebe18db133cec108f4d14ce00dd9ae',
    chain: {
      chainId: 8453,
      chainKey: 'base',
    },
    type: 'Rewards',
    openedAt: '2024-10-15T12:30:00.000Z',
    latest: {
      date: '2025-11-27T00:00:00.000Z',
      tvlUsd: '850000000',
      tvlNative: '850000000',
      apy: {
        base: 2.8,
        reward: 0.5,
        total: 3.3,
      },
    },
    protocol: {
      name: 'Merkl',
      logo: 'https://static.debank.com/image/project/logo_url/merkl/7c4a97689b3310cc3436bc6e1a215476.png',
      url: 'https://app.merkl.xyz',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '21228119770743320',
        amountUSD: 0.03252784792470999,
        name: 'Morpho Token',
        symbol: 'MORPHO',
        decimals: 18,
        logo: 'https://static.debank.com/image/base_token/logo_url/0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842/c092d2c513136e17883955cdd2c62ff1.png',
        address: '0xbaa5cc21fd487b8fcc2f632f3f4e8d37262a0842',
        chain: {
          chainId: 8453,
          chainKey: 'base',
        },
        priceUSD: 1.5323,
      },
      {
        chainType: 'EVM',
        amount: '9402301108809442',
        amountUSD: 0,
        name: 'Angle Merkl',
        symbol: 'aglaMerkl',
        decimals: 18,
        logo: '',
        address: '0xc011882d0f7672d8942e7fe2248c174eed640c8f',
        chain: {
          chainId: 8453,
          chainKey: 'base',
        },
        priceUSD: 0,
      },
      {
        chainType: 'EVM',
        amount: '161546331630',
        amountUSD: 0.0004884708738762635,
        name: 'Wrapped Ether',
        symbol: 'WETH',
        decimals: 18,
        logo: 'https://static.debank.com/image/eth_token/logo_url/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2/61844453e63cf81301f845d7864236f6.png',
        address: '0x4200000000000000000000000000000000000006',
        chain: {
          chainId: 8453,
          chainKey: 'base',
        },
        priceUSD: 3023.72,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

export const eulerPositions: DefiPosition[] = [
  {
    name: 'Euler',
    assetUsd: 12.020139013901389,
    debtUsd: 0,
    netUsd: 12.020139013901389,
    address: '0x3b4802fdb0e5d74aa37d58fd77d63e93d4f9a4af',
    chain: {
      chainId: 1,
      chainKey: 'eth',
    },
    type: 'Yield',
    protocol: {
      name: 'Euler',
      logo: 'https://static.debank.com/image/project/logo_url/euler2/672f19349da6dd7cdf30621720681753.png',
      url: 'https://www.euler.finance/',
    },
    supplyTokens: [
      {
        chainType: 'EVM',
        amount: '12018937',
        amountUSD: 12.020139013901389,
        name: 'USD Coin',
        symbol: 'USDC',
        decimals: 6,
        logo: 'https://static.debank.com/image/eth_token/logo_url/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/fffcd27b9efff5a86ab942084c05924d.png',
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        chain: {
          chainId: 1,
          chainKey: 'eth',
        },
        priceUSD: 1.000100010001,
      },
    ],
    borrowTokens: [],
    assetTokens: [],
    collateralTokens: [],
    rewardTokens: [],
  },
];

export const defiPositionGroups: DefiPosition[][] = [
  aavePositions,
  morphoPositions,
  hyperwavePositions,
  merklPositions,
  eulerPositions,
];

export const tokenTinyAmounts: MinimalToken[] = [
  {
    address: tokenAddresses.ETH,
    chain: ethereumChain,
    symbol: 'ETH',
    balance: 5.25,
    totalPriceUSD: 0.0005,
  },
  {
    address: tokenAddresses.USDC_ETHEREUM,
    chain: ethereumChain,
    symbol: 'USDC',
    balance: 2.5,
    totalPriceUSD: 0.0001,
    relatedTokens: [
      {
        address: tokenAddresses.USDC_BASE,
        chain: baseChain,
        symbol: 'USDC',
        balance: 1.0,
        totalPriceUSD: 0.0001,
      },
    ],
  },
  {
    address: tokenAddresses.USDT,
    chain: ethereumChain,
    symbol: 'USDT',
    balance: 1.8,
    totalPriceUSD: 0.0001,
  },
  {
    address: tokenAddresses.WBTC,
    chain: ethereumChain,
    symbol: 'WBTC',
    balance: 0.15,
    totalPriceUSD: 0.0003,
  },
];
