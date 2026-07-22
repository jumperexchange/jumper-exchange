import { describe, expect, it } from 'vitest';
import type { LimitOrder as Order } from '@/types/jumper-backend';
import {
  getOrderFilledPercent,
  getOrderLimitPrice,
  getOrderMarketPrice,
} from './utils';

const baseOrder: Order = {
  orderId: 'order-1',
  tool: 'cowswap',
  chainId: 1,
  fromAddress: '0xabc',
  fromToken: {
    address: '0x1',
    chainId: 1,
    symbol: 'UNI',
    name: 'Uniswap',
    decimals: 18,
    priceUSD: '3.31',
  },
  fromAmount: '450000000000000000000',
  filledFromAmount: '166500000000000000000',
  toToken: {
    address: '0x2',
    chainId: 1,
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    priceUSD: '1.00',
  },
  toAmount: '1479260000',
  filledToAmount: '547326000',
  createdAt: 1700000000,
  validUntil: 1700086400,
  status: 'partially_filled',
  orderType: 'partial_fill',
};

describe('utils', () => {
  it('computes limit price for alt -> stable', () => {
    expect(getOrderLimitPrice(baseOrder)).toBeCloseTo(3.287, 2);
  });

  it('computes limit price for stable -> alt', () => {
    const order: Order = {
      ...baseOrder,
      fromToken: baseOrder.toToken,
      toToken: baseOrder.fromToken,
      fromAmount: '2000000000',
      toAmount: '742960000000000000000',
    };
    expect(getOrderLimitPrice(order)).toBeCloseTo(2.69, 2);
  });

  it('returns market price for the non-stable token', () => {
    expect(getOrderMarketPrice(baseOrder)).toBe(3.31);
  });

  it('computes filled percent from sell-side amounts', () => {
    expect(getOrderFilledPercent(baseOrder)).toBe(37);
  });
});
