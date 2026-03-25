import type { Balance, ExtendedToken } from '@/types/tokens';
import type { ExtendedChain } from '@lifi/sdk';
import { ChainKey, ChainType, CoinKey } from '@lifi/sdk';
import { zeroAddress } from 'viem';

export const chains: ExtendedChain[] = [
  {
    id: 1,
    name: 'Ethereum',
    key: ChainKey.ETH,
    chainType: ChainType.EVM,
    logoURI:
      'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/ethereum.svg',
    metamask: {
      chainId: '1',
      chainName: 'Ethereum',
      blockExplorerUrls: [],
      rpcUrls: [],
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    nativeToken: {
      priceUSD: '0',
      symbol: 'ETH',
      decimals: 18,
      name: 'ETH',
      chainId: 1,
      address: zeroAddress,
    },
    coin: CoinKey.ETH,
    mainnet: true,
  },
  {
    id: 42161,
    name: 'Arbitrum',
    key: ChainKey.ARB,
    chainType: ChainType.EVM,
    logoURI:
      'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/arbitrum.svg',
    metamask: {
      chainId: '42161',
      chainName: 'Arbitrum',
      blockExplorerUrls: [],
      rpcUrls: [],
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    nativeToken: {
      priceUSD: '0',
      symbol: 'ETH',
      decimals: 18,
      name: 'ETH',
      chainId: 42161,
      address: zeroAddress,
    },
    coin: CoinKey.ETH,
    mainnet: false,
  },
  {
    id: 10,
    name: 'Optimism',
    key: ChainKey.OPT,
    chainType: ChainType.EVM,
    logoURI:
      'https://raw.githubusercontent.com/lifinance/types/main/src/assets/icons/chains/optimism.svg',
    metamask: {
      chainId: '10',
      chainName: 'Optimism',
      blockExplorerUrls: [],
      rpcUrls: [],
      nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    },
    nativeToken: {
      priceUSD: '0',
      symbol: 'ETH',
      decimals: 18,
      name: 'ETH',
      chainId: 10,
      address: zeroAddress,
    },
    coin: CoinKey.ETH,
    mainnet: false,
  },
];

export const tokens: ExtendedToken[] = [
  {
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    chainId: 1,
    type: 'extended',
    priceUSD: '1.00',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    chainId: 1,
    type: 'extended',
    priceUSD: '1.00',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
  {
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    chainId: 1,
    type: 'extended',
    priceUSD: '1.00',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png',
  },
  {
    address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    chainId: 42161,
    type: 'extended',
    priceUSD: '1.00',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
  },
  {
    address: '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    name: 'Tether USD',
    symbol: 'USDT',
    decimals: 6,
    chainId: 42161,
    type: 'extended',
    priceUSD: '1.00',
    logoURI:
      'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
  },
];

export const balances: Balance[] = [
  {
    amount: 5_500_000n, // ~$5.50
    token: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 1,
      priceUSD: '1.00',
      type: 'extended',
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
  },
  {
    amount: 8_000_000n, // ~$8.00
    token: {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      name: 'Tether USD',
      symbol: 'USDT',
      decimals: 6,
      chainId: 1,
      priceUSD: '1.00',
      type: 'extended',
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
    },
  },
  {
    amount: 25_000_000_000_000_000n, // ~$60
    token: {
      address: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      name: 'Wrapped Ether',
      symbol: 'WETH',
      decimals: 18,
      chainId: 42161,
      priceUSD: '2400.00',
      type: 'extended',
      logoURI:
        'https://static.debank.com/image/era_token/logo_url/0x5aea5775959fbc2557cc8789bc1bf90a239d9a91/61844453e63cf81301f845d7864236f6.png',
    },
  },
  {
    amount: 30_000_000n, // ~$30
    token: {
      address: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
      name: 'USD Coin',
      symbol: 'USDC',
      decimals: 6,
      chainId: 42161,
      priceUSD: '1.00',
      type: 'extended',
      logoURI:
        'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
    },
  },
];
