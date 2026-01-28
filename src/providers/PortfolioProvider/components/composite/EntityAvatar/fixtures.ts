import type { PositionToken } from '@/types/tokens';
import type { Protocol } from '@/types/jumper-backend';
import type { ExtendedChain } from '@lifi/sdk';

export const mockPortfolioTokens: Record<string, PositionToken> = {
  eth: {
    type: 'position',
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
    type: 'position',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    priceUSD: '1',
    chainId: 1,
  },
  wbtc: {
    type: 'position',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
    priceUSD: '95000',
    chainId: 1,
  },
  dai: {
    type: 'position',
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

export const mockProtocols: Record<string, Protocol> = {
  aave: {
    name: 'Aave',
    product: 'Lending',
    logo: 'https://static.debank.com/image/project/logo_url/aave3/07c2b18dab88c41c58d0e40da4bce9e8.png',
  },
  uniswap: {
    name: 'Uniswap',
    product: 'DEX',
    logo: 'https://static.debank.com/image/project/logo_url/uniswap3/87990c650c3f2a1c1e4f3e1c5c3c8e4a.png',
  },
};

export const mockExtendedChains: Record<string, Partial<ExtendedChain>> = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    logoURI:
      'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg',
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    logoURI:
      'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg',
  },
};
