import { ChainId } from '@lifi/sdk';

export const MAX_DISPLAY_ASSETS_COUNT = 4;
export const MAX_DISPLAY_ASSETS_COUNT_MOBILE = 3;
export const THRESHOLD_MIN_AMOUNT = 0.01;

export const DEFAULT_NO_CONTENT_TOKENS = [
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    type: 'base',
    chainId: ChainId.ETH,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    type: 'base',
    chainId: ChainId.DAI,
    symbol: 'XDAI',
    name: 'XDAI',
    decimals: 18,
  },
  {
    address: '0x4200000000000000000000000000000000000042',
    type: 'base',
    chainId: ChainId.OPT,
    symbol: 'OP',
    name: 'Optimism',
    decimals: 18,
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    type: 'base',
    chainId: ChainId.ARB,
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
  },
];
