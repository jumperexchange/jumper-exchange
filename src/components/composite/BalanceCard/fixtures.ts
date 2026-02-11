import type {
  ExtendedToken,
  PortfolioBalance,
  WalletToken,
} from '@/types/tokens';

// Mock ExtendedTokens for different chains
const mockExtendedTokens: Record<string, WalletToken> = {
  ethMainnet: {
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
  ethArbitrum: {
    type: 'wallet',
    address: '0x0000000000000000000000000000000000000000',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    priceUSD: '3500',
    chainId: 42161,
    chainKey: 'arb',
  },
  ethOptimism: {
    type: 'wallet',
    address: '0x0000000000000000000000000000000000000000',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    priceUSD: '3500',
    chainId: 10,
    chainKey: 'opt',
  },
  ethBase: {
    type: 'wallet',
    address: '0x0000000000000000000000000000000000000000',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    priceUSD: '3500',
    chainId: 8453,
    chainKey: 'bas',
  },
  usdcMainnet: {
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
  usdcPolygon: {
    type: 'wallet',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    priceUSD: '1',
    chainId: 137,
    chainKey: 'pol',
  },
  dai: {
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
};

// Single chain balance
export const mockSingleChainBalance: PortfolioBalance<WalletToken>[] = [
  {
    amount: 1500000000000000000n, // 1.5 ETH
    amountUSD: 5250,
    token: mockExtendedTokens.ethMainnet,
  },
];

// Multi-chain ETH balances
export const mockMultiChainEthBalances: PortfolioBalance<WalletToken>[] = [
  {
    amount: 1000000000000000000n, // 1 ETH
    amountUSD: 3500,
    token: mockExtendedTokens.ethMainnet,
  },
  {
    amount: 500000000000000000n, // 0.5 ETH
    amountUSD: 1750,
    token: mockExtendedTokens.ethArbitrum,
  },
  {
    amount: 250000000000000000n, // 0.25 ETH
    amountUSD: 875,
    token: mockExtendedTokens.ethOptimism,
  },
  {
    amount: 100000000000000000n, // 0.1 ETH
    amountUSD: 350,
    token: mockExtendedTokens.ethBase,
  },
];

// Multi-chain USDC balances
export const mockMultiChainUsdcBalances: PortfolioBalance<WalletToken>[] = [
  {
    amount: 5000000000n, // 5,000 USDC
    amountUSD: 5000,
    token: mockExtendedTokens.usdcMainnet,
  },
  {
    amount: 2500000000n, // 2,500 USDC
    amountUSD: 2500,
    token: mockExtendedTokens.usdcPolygon,
  },
];

// Single DAI balance
export const mockDaiBalance: PortfolioBalance<WalletToken>[] = [
  {
    amount: 10000000000000000000000n, // 10,000 DAI
    amountUSD: 10000,
    token: mockExtendedTokens.dai,
  },
];

// Large balance for compact display testing
export const mockLargeBalance: PortfolioBalance<WalletToken>[] = [
  {
    amount: 1000000000000000000000000n, // 1M tokens
    amountUSD: 1000000,
    token: mockExtendedTokens.dai,
  },
];

// Small balance
export const mockSmallBalance: PortfolioBalance<WalletToken>[] = [
  {
    amount: 100000n, // 0.1 USDC
    amountUSD: 0.1,
    token: mockExtendedTokens.usdcMainnet,
  },
];
