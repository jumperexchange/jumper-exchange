import type { SummaryData } from '@/providers/PortfolioProvider/types';

export const mockSummaryData: SummaryData = {
  totalBalancesUsd: 25000,
  totalPositionsUsd: 15000,
  totalPortfolioUsd: 40000,
  balancesBySymbol: {
    ETH: {
      balances: [
        {
          amount: 1000000000000000000n,
          amountUSD: 3500,
          percentage: 8.75,
          token: {
            type: 'wallet',
            address: '0x0000000000000000000000000000000000000000',
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
            priceUSD: '3500',
            chainId: 1,
            chainKey: 'eth',
          },
        },
        {
          amount: 2000000000000000000n,
          amountUSD: 6500,
          percentage: 16.25,
          token: {
            type: 'wallet',
            address: '0x0000000000000000000000000000000000000000',
            name: 'Ethereum',
            symbol: 'ETH',
            decimals: 18,
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
            priceUSD: '3250',
            chainId: 42161,
            chainKey: 'arb',
          },
        },
      ],
      totalUsd: 10000,
      percentage: 25,
    },
    USDC: {
      balances: [
        {
          amount: 10000000000n,
          amountUSD: 10000,
          percentage: 25,
          token: {
            type: 'wallet',
            address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            name: 'USD Coin',
            symbol: 'USDC',
            decimals: 6,
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            priceUSD: '1',
            chainId: 1,
            chainKey: 'eth',
          },
        },
      ],
      totalUsd: 10000,
      percentage: 25,
    },
    DAI: {
      balances: [
        {
          amount: 5000000000000000000000n,
          amountUSD: 5000,
          percentage: 12.5,
          token: {
            type: 'wallet',
            address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            name: 'Dai',
            symbol: 'DAI',
            decimals: 18,
            logoURI:
              'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
            priceUSD: '1',
            chainId: 1,
            chainKey: 'eth',
          },
        },
      ],
      totalUsd: 5000,
      percentage: 12.5,
    },
  },
  positionsByProtocol: {
    Aave: {
      positions: [],
      totalUsd: 10000,
      percentage: 25,
    },
    Uniswap: {
      positions: [],
      totalUsd: 5000,
      percentage: 12.5,
    },
  },
};

export const mockEmptySummaryData: SummaryData = {
  totalBalancesUsd: 0,
  totalPositionsUsd: 0,
  totalPortfolioUsd: 0,
  balancesBySymbol: {},
  positionsByProtocol: {},
};

export const mockTokensOnlySummaryData: SummaryData = {
  ...mockSummaryData,
  totalPositionsUsd: 0,
  positionsByProtocol: {},
};

export const mockPositionsOnlySummaryData: SummaryData = {
  ...mockSummaryData,
  totalBalancesUsd: 0,
  balancesBySymbol: {},
};
