import type { LimitPriceChanged } from '@jumperexchange/widget';
import { describe, expect, it } from 'vitest';
import type { BaseToken } from '@/types/tokens';
import { deriveLimitPriceLine } from './limitPriceLine';

const fromToken = {
  chainId: 1,
  address: '0xFrom',
} as unknown as BaseToken;
const toToken = {
  chainId: 1,
  address: '0xTo',
} as unknown as BaseToken;

const limitPrice: LimitPriceChanged = {
  price: '2000', // 2000 toToken per fromToken
  fromChainId: 1,
  fromTokenAddress: '0xfrom',
  toChainId: 1,
  toTokenAddress: '0xto',
};

const base = {
  limitPrice,
  fromToken,
  toToken,
  activeSymbol: 'from',
  fromSymbol: 'from',
  toSymbol: 'to',
  fromTokenUsdPrice: 2000,
  toTokenUsdPrice: 1, // stablecoin quote
};

describe('deriveLimitPriceLine', () => {
  it('converts canonical ratio to USD via the toToken price', () => {
    expect(deriveLimitPriceLine({ ...base, toTokenUsdPrice: 1 })).toEqual({
      price: 2000,
    });
    expect(deriveLimitPriceLine({ ...base, toTokenUsdPrice: 0.5 })).toEqual({
      price: 1000,
    });
  });

  it('shows the inverted price on the toToken chart', () => {
    // 1/2000 × fromTokenUsdPrice(2000) = 1
    expect(deriveLimitPriceLine({ ...base, activeSymbol: 'to' })).toEqual({
      price: 1,
    });
  });

  it('returns undefined when the chart shows neither side of the pair', () => {
    expect(
      deriveLimitPriceLine({ ...base, activeSymbol: 'unrelated' }),
    ).toBeUndefined();
  });

  it('ignores a stale price from a different pair', () => {
    const stale = { ...limitPrice, toTokenAddress: '0xother' };
    expect(
      deriveLimitPriceLine({ ...base, limitPrice: stale }),
    ).toBeUndefined();
  });

  it('returns undefined without a usable price or conversion rate', () => {
    expect(
      deriveLimitPriceLine({ ...base, limitPrice: undefined }),
    ).toBeUndefined();
    expect(
      deriveLimitPriceLine({ ...base, toTokenUsdPrice: null }),
    ).toBeUndefined();
    expect(
      deriveLimitPriceLine({
        ...base,
        limitPrice: { ...limitPrice, price: '0' },
      }),
    ).toBeUndefined();
  });
});
