import type { PortfolioToken } from 'src/types/tokens';

const mockTokens: PortfolioToken[] = [
  {
    address: '0xc21223249CA28397B4B6541dfFaEcC539BfF0c59',
    chain: {
      chainId: 25,
      chainKey: 'Cronos',
    },
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    balance: 154.71668548264046,
    totalPriceUSD: 154.6886497866626,
    relatedTokens: [
      {
        address: '0xb88339CB7199b77E23DB6E890353E22632Ba630f',
        chain: {
          chainId: 999,
          chainKey: 'HyperEVM',
        },
        symbol: 'USDC',
        name: 'USDC',
        decimals: 6,
        logo: undefined,
        balance: 82.635515,
        totalPriceUSD: 82.619566345605,
      },
      {
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        chain: {
          chainId: 1337,
          chainKey: 'Hyperliquid',
        },
        symbol: 'USDC',
        name: 'USD Coin (Perps)',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        balance: 17.705719,
        totalPriceUSD: 17.70301250379366,
      },
      {
        address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        chain: {
          chainId: 42161,
          chainKey: 'Arbitrum',
        },
        symbol: 'USDC',
        name: 'USD Coin',
        decimals: 6,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
        balance: 10.97198,
        totalPriceUSD: 10.9703028231372,
      },
    ],
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    chain: {
      chainId: 10,
      chainKey: 'Optimism',
    },
    symbol: 'ETH',
    name: 'ETH',
    decimals: 18,
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
    balance: 0.030462952541019373,
    totalPriceUSD: 121.17372169918664,
    relatedTokens: [
      {
        address: '0x0000000000000000000000000000000000000000',
        chain: {
          chainId: 60808,
          chainKey: 'BOB',
        },
        symbol: 'ETH',
        name: 'ETH',
        decimals: 18,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        balance: 0.005317399040696918,
        totalPriceUSD: 21.154557924817126,
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        chain: {
          chainId: 42161,
          chainKey: 'Arbitrum',
        },
        symbol: 'ETH',
        name: 'ETH',
        decimals: 18,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        balance: 0.00477497922562207,
        totalPriceUSD: 18.987895889855185,
      },
      {
        address: '0x0000000000000000000000000000000000000000',
        chain: {
          chainId: 8453,
          chainKey: 'Base',
        },
        symbol: 'ETH',
        name: 'ETH',
        decimals: 18,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png',
        balance: 0.002374899904069809,
        totalPriceUSD: 9.443884464529757,
      },
    ],
  },
];

export const walletBalanceCardFixture = {
  walletAddress: '0x1234567890123456789012345678901234567890',
  refetch: () => {},
  isFetching: false,
  isSuccess: true,
  data: mockTokens,
};
