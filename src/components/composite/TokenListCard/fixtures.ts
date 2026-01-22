import { zeroAddress } from 'viem';
import type { PortfolioToken } from 'src/types/tokens';

export const tokenMultipleChains: PortfolioToken = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  chain: {
    chainId: 1,
    chainKey: 'ethereum',
  },
  symbol: 'USDC',
  name: 'USD Coin',
  decimals: 6,
  balance: 2.5,
  totalPriceUSD: 8625.3,
  relatedTokens: [
    {
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chain: {
        chainId: 1,
        chainKey: 'ethereum',
      },
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      balance: 1.5,
      totalPriceUSD: 5175.18,
    },
    {
      address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
      chain: {
        chainId: 8453,
        chainKey: 'base',
      },
      symbol: 'USDC',
      name: 'USD Coin',
      decimals: 6,
      balance: 1.0,
      totalPriceUSD: 3450.12,
    },
  ],
};

export const tokenSingleChain: PortfolioToken = {
  address: zeroAddress,
  chain: {
    chainId: 8453,
    chainKey: 'base',
  },
  symbol: 'ETH',
  name: 'Ethereum',
  decimals: 18,
  balance: 2.5,
  totalPriceUSD: 8625.3,
};
