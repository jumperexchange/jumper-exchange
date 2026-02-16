import { ProcessingTransactionCardStatus } from './types';

export const commonArgs = {
  fromToken: {
    address: '0x0000000000000000000000000000000000000000',
    name: 'ETH',
    symbol: 'ETH',
    decimals: 18,
    type: 'extended',
    priceUSD: '1000',
    chainId: 1,
  },
  toToken: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 18,
    type: 'extended',
    priceUSD: '1000',
    chainId: 1,
  },
  status: ProcessingTransactionCardStatus.PENDING,
  title: 'Processing Transaction',
  description: 'This is a sample transaction description.',
} as const;
