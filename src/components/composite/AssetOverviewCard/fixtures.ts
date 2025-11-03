import { MinimalDeFiPosition } from 'src/types/defi';
import { MinimalToken } from 'src/types/tokens';

export const tokens: MinimalToken[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'ETH',
    balance: 5.25,
    totalPriceUSD: 18562.5,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'USDC',
    balance: 2.5,
    totalPriceUSD: 8625.3,
    relatedTokens: [
      {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        chain: {
          chainId: 8453,
          chainKey: 'base',
        },
        symbol: 'USDC',
        balance: 1.0,
        totalPriceUSD: 3450.12,
      },
    ],
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'USDT',
    balance: 1.8,
    totalPriceUSD: 6210.24,
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDd86a3D015C766',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'WBTC',
    balance: 0.15,
    totalPriceUSD: 9847.5,
  },
  {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'DAI',
    balance: 3.2,
    totalPriceUSD: 3211.84,
  },
];

export const defiPositions: MinimalDeFiPosition[] = [
  {
    name: 'Morpho',
    product: 'metamorpho',
    version: '1.0.0',
    logo: 'https://strapi.jumper.exchange/uploads/morpho_eef0686ee3_2e4b8e06a6.png',
    balance: 2.5,
    totalPriceUSD: 8625.3,
  },
  {
    name: 'Aave',
    product: 'lending',
    version: '3.0.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/aave_3a6741f1bd.png',
    balance: 1.8,
    totalPriceUSD: 6210.24,
    relatedProtocols: [
      {
        name: 'Aave',
        product: 'borrowing',
        version: '3.0.0',
        logo: 'https://strapi-staging.jumper.exchange/uploads/aave_3a6741f1bd.png',
        balance: 0.5,
        totalPriceUSD: 1725.06,
      },
    ],
  },
  {
    name: 'Angle',
    product: 'dex',
    version: '2.1.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/angle_cc79b057df.png',
    balance: 0.75,
    totalPriceUSD: 2587.5,
  },
  {
    name: 'Frax',
    product: 'frax eth',
    version: '4.0.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/frax_0e286763eb.png',
    balance: 3.2,
    totalPriceUSD: 11043.84,
  },
  {
    name: 'Lido',
    product: 'liquid-staking',
    version: '2.0.0',
    logo: 'https://strapi-staging.jumper.exchange/uploads/lido_47c6f066b5.png',
    balance: 1.5,
    totalPriceUSD: 5175.18,
  },
];

export const tokenTinyAmounts: MinimalToken[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'ETH',
    balance: 5.25,
    totalPriceUSD: 0.0005,
  },
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'USDC',
    balance: 2.5,
    totalPriceUSD: 0.0001,
    relatedTokens: [
      {
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        chain: {
          chainId: 8453,
          chainKey: 'base',
        },
        symbol: 'USDC',
        balance: 1.0,
        totalPriceUSD: 0.0001,
      },
    ],
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'USDT',
    balance: 1.8,
    totalPriceUSD: 0.0001,
  },
  {
    address: '0x2260FAC5E5542a773Aa44fBCfeDd86a3D015C766',
    chain: {
      chainId: 1,
      chainKey: 'ethereum',
    },
    symbol: 'WBTC',
    balance: 0.15,
    totalPriceUSD: 0.0003,
  },
];
