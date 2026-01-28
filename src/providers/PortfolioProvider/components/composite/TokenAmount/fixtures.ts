import type { TokenBalance, ExtendedToken } from '@/types/tokens';

const mockExtendedTokens: Record<string, ExtendedToken> = {
  eth: {
    type: 'extended',
    address: '0x0000000000000000000000000000000000000000',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    priceUSD: '3500',
    chainId: 1,
  },
  usdc: {
    type: 'extended',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    priceUSD: '1',
    chainId: 1,
  },
  dai: {
    type: 'extended',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    name: 'Dai',
    symbol: 'DAI',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
    priceUSD: '1',
    chainId: 1,
  },
};

export const mockTokenBalances: Record<string, TokenBalance> = {
  eth: {
    amount: 1500000000000000000n, // 1.5 ETH
    token: mockExtendedTokens.eth,
  },
  usdc: {
    amount: 10000000000n, // 10,000 USDC
    token: mockExtendedTokens.usdc,
  },
  largeBalance: {
    amount: 1000000000000000000000000n, // 1M tokens
    token: mockExtendedTokens.dai,
  },
};
