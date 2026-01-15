import type { PortfolioPositionSummary } from '@/providers/PortfolioProvider/types/positions.types';
import type { PortfolioTokenSummary } from '@/providers/PortfolioProvider/types/tokens.types';

const ethereumChain = {
  chainId: 1,
  chainKey: 'ethereum' as const,
};

const baseChain = {
  chainId: 8453,
  chainKey: 'base' as const,
};

const arbitrumChain = {
  chainId: 42161,
  chainKey: 'arb' as const,
};

const katanaChain = {
  chainId: 747474,
  chainKey: 'katana' as const,
};

const hyperChain = {
  chainId: 999,
  chainKey: 'hyper' as const,
};

const tokenAddresses = {
  ETH: '0x0000000000000000000000000000000000000000',
  USDC_ETHEREUM: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDC_BASE: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  WBTC: '0x2260FAC5E5542a773Aa44fBCfeDd86a3D015C766',
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
};

export const tokens: PortfolioTokenSummary[] = [
  {
    address: tokenAddresses.ETH,
    chain: ethereumChain,
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    totalValueUSD: 18562.5,
    formattedTotalValueUSD: '$18,562.50',
    balance: 5.25,
    formattedBalance: '5.25',
    percentageOfTotalValueUSD: 40.12,
  },
  {
    address: tokenAddresses.USDC_ETHEREUM,
    chain: ethereumChain,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    totalValueUSD: 8625.3,
    formattedTotalValueUSD: '$8,625.30',
    balance: 2.5,
    formattedBalance: '2.50',
    percentageOfTotalValueUSD: 18.65,
  },
  {
    address: tokenAddresses.USDT,
    chain: ethereumChain,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    totalValueUSD: 6210.24,
    formattedTotalValueUSD: '$6,210.24',
    balance: 1.8,
    formattedBalance: '1.80',
    percentageOfTotalValueUSD: 13.42,
  },
  {
    address: tokenAddresses.WBTC,
    chain: ethereumChain,
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    totalValueUSD: 9847.5,
    formattedTotalValueUSD: '$9,847.50',
    balance: 0.15,
    formattedBalance: '0.15',
    percentageOfTotalValueUSD: 21.28,
  },
  {
    address: tokenAddresses.DAI,
    chain: ethereumChain,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    decimals: 18,
    totalValueUSD: 3211.84,
    formattedTotalValueUSD: '$3,211.84',
    balance: 3.2,
    formattedBalance: '3.20',
    percentageOfTotalValueUSD: 6.53,
  },
];

export const tokensTotalValueUSD = tokens.reduce(
  (sum, token) => sum + token.totalValueUSD,
  0,
);

export const positions: PortfolioPositionSummary[] = [
  {
    name: 'Aave V3',
    address: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
    chain: arbitrumChain,
    protocol: {
      name: 'Aave V3',
      logo: 'https://static.debank.com/image/project/logo_url/aave3/54df7839ab09493ba7540ab832590255.png',
      url: 'https://app.aave.com',
    },
    totalValueUSD: 1.0017831783178317,
    formattedTotalValueUSD: '$1.00',
    percentageOfTotalValueUSD: 0.55,
  },
  {
    name: 'Morpho',
    address: '0xc5e7ab07030305fc925175b25b93b285d40dcdff',
    chain: katanaChain,
    protocol: {
      name: 'Morpho',
      logo: 'https://static.debank.com/image/project/logo_url/morphoblue/cfe5f811a4fb96355e0fb367b5201f87.png',
      url: 'https://app.morpho.org',
    },
    totalValueUSD: 136.62,
    formattedTotalValueUSD: '$136.62',
    percentageOfTotalValueUSD: 74.93,
  },
  {
    name: 'Hyperwave',
    address: '0x4de03ca1f02591b717495cfa19913ad56a2f5858',
    chain: hyperChain,
    protocol: {
      name: 'Hyperwave',
      logo: 'https://static.debank.com/image/project/logo_url/hyper_hyperwavefi/13f0393f633a2a1fe6e709bd9c37d514.png',
      url: 'https://app.hyperwavefi.xyz',
    },
    totalValueUSD: 17.148273267639563,
    formattedTotalValueUSD: '$17.15',
    percentageOfTotalValueUSD: 9.41,
  },
  {
    name: 'Merkl',
    address: '0x3ef3d8ba38ebe18db133cec108f4d14ce00dd9ae',
    chain: baseChain,
    protocol: {
      name: 'Merkl',
      logo: 'https://static.debank.com/image/project/logo_url/merkl/7c4a97689b3310cc3436bc6e1a215476.png',
      url: 'https://app.merkl.xyz',
    },
    totalValueUSD: 0.03301631879858625,
    formattedTotalValueUSD: '$0.03',
    percentageOfTotalValueUSD: 0.02,
  },
  {
    name: 'Euler',
    address: '0x3b4802fdb0e5d74aa37d58fd77d63e93d4f9a4af',
    chain: ethereumChain,
    protocol: {
      name: 'Euler',
      logo: 'https://static.debank.com/image/project/logo_url/euler2/672f19349da6dd7cdf30621720681753.png',
      url: 'https://www.euler.finance/',
    },
    totalValueUSD: 12.020139013901389,
    formattedTotalValueUSD: '$12.02',
    percentageOfTotalValueUSD: 6.59,
  },
  {
    name: 'Compound',
    address: '0x1234567890abcdef1234567890abcdef12345678',
    chain: ethereumChain,
    protocol: {
      name: 'Compound',
      logo: 'https://static.debank.com/image/project/logo_url/compound/4711e1d7ef26f69eed04c3e2deaae100.png',
      url: 'https://compound.finance/',
    },
    totalValueUSD: 15.5,
    formattedTotalValueUSD: '$15.50',
    percentageOfTotalValueUSD: 8.5,
  },
];

export const positionsTotalValueUSD = positions.reduce(
  (sum, position) => sum + position.totalValueUSD,
  0,
);

export const tokenTinyAmounts: PortfolioTokenSummary[] = [
  {
    address: tokenAddresses.ETH,
    chain: ethereumChain,
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    totalValueUSD: 0.0005,
    formattedTotalValueUSD: '$0.0005',
    balance: 5.25,
    formattedBalance: '5.25',
    percentageOfTotalValueUSD: 50,
  },
  {
    address: tokenAddresses.USDC_ETHEREUM,
    chain: ethereumChain,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    totalValueUSD: 0.0001,
    formattedTotalValueUSD: '$0.0001',
    balance: 2.5,
    formattedBalance: '2.50',
    percentageOfTotalValueUSD: 10,
  },
  {
    address: tokenAddresses.USDT,
    chain: ethereumChain,
    symbol: 'USDT',
    name: 'Tether USD',
    decimals: 6,
    totalValueUSD: 0.0001,
    formattedTotalValueUSD: '$0.0001',
    balance: 1.8,
    formattedBalance: '1.80',
    percentageOfTotalValueUSD: 10,
  },
  {
    address: tokenAddresses.WBTC,
    chain: ethereumChain,
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    totalValueUSD: 0.0003,
    formattedTotalValueUSD: '$0.0003',
    balance: 0.15,
    formattedBalance: '0.15',
    percentageOfTotalValueUSD: 30,
  },
];

export const tokenTinyAmountsTotalValueUSD = tokenTinyAmounts.reduce(
  (sum, token) => sum + token.totalValueUSD,
  0,
);
