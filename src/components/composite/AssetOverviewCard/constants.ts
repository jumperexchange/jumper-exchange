import { ChainId } from '@lifi/sdk';

export const MAX_DISPLAY_ASSETS_COUNT = 4;
export const MAX_DISPLAY_ASSETS_COUNT_MOBILE = 3;
export const THRESHOLD_MIN_AMOUNT = 0.01;

export const DEFAULT_NO_CONTENT_TOKENS = [
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chain: {
      chainId: ChainId.ETH,
      chainKey: 'ethereum',
    },
    symbol: 'USDC',
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    chain: {
      chainId: ChainId.DAI,
      chainKey: 'gnosis',
    },
    symbol: 'XDAI',
  },
  {
    address: '0x4200000000000000000000000000000000000042',
    chain: {
      chainId: ChainId.OPT,
      chainKey: 'optimism',
    },
    symbol: 'OP',
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    chain: {
      chainId: ChainId.ETH,
      chainKey: 'ethereum',
    },
    symbol: 'ETH',
  },
];
