import { zeroAddress } from 'viem';

export const tokenMultipleChains = {
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
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chain: {
        chainId: 1,
        chainKey: 'ethereum',
      },
      symbol: 'USDC',
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
      balance: 1.0,
      totalPriceUSD: 3450.12,
    },
  ],
};

export const tokenSingleChain = {
  address: zeroAddress,
  chain: {
    chainId: 8453,
    chainKey: 'base',
  },
  symbol: 'ETH',
  balance: 2.5,
  totalPriceUSD: 8625.3,
};
