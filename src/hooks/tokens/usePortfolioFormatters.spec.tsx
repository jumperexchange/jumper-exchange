import type { PortfolioBalance, PricedToken } from '@/types/tokens';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NBSP } from '@/utils/formatNumbers';
import { usePortfolioFormatters } from './usePortfolioFormatters';

const buildBalance = (
  amount: bigint,
  amountUSD: number,
  overrides: Partial<PricedToken> = {},
): PortfolioBalance<PricedToken> => ({
  amount,
  amountUSD,
  token: {
    type: 'extended',
    address: '0x0000000000000000000000000000000000000000',
    chainId: 1,
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    priceUSD: '2000',
    ...overrides,
  } as PricedToken,
});

describe('usePortfolioFormatters', () => {
  describe('toDisplayAggregatedAmount', () => {
    it('collapses dust amount on a single balance to <0.0001 SYMBOL', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      // 1 wei with 18 decimals = 0.000000000000000001
      const balances = [buildBalance(1n, 0)];

      expect(result.current.toDisplayAggregatedAmount(balances)).toBe(
        `<0.0001${NBSP}ETH`,
      );
    });

    it('does not collapse amount exactly at the threshold boundary', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      // 1e14 wei with 18 decimals = 0.0001 exactly
      const balances = [buildBalance(100000000000000n, 0)];

      expect(result.current.toDisplayAggregatedAmount(balances)).toBe(
        `format.decimal${NBSP}ETH`,
      );
    });

    it('returns localized decimal + symbol for normal amounts', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      // 1e18 wei with 18 decimals = 1
      const balances = [buildBalance(1000000000000000000n, 2000)];

      expect(result.current.toDisplayAggregatedAmount(balances)).toBe(
        `format.decimal${NBSP}ETH`,
      );
    });

    it('collapses dust on summed multi-balance totals', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      // two dust balances that still sum below 0.0001
      const balances = [buildBalance(1n, 0), buildBalance(2n, 0)];

      expect(result.current.toDisplayAggregatedAmount(balances)).toBe(
        `<0.0001${NBSP}ETH`,
      );
    });

    it('does not collapse zero', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      const balances = [buildBalance(0n, 0)];

      expect(result.current.toDisplayAggregatedAmount(balances)).toBe(
        `format.decimal${NBSP}ETH`,
      );
    });
  });

  describe('toDisplayAggregatedAmountUSD', () => {
    it('collapses sub-cent total to <$0.01', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      const balances = [buildBalance(1n, 0.002)];

      expect(result.current.toDisplayAggregatedAmountUSD(balances)).toBe(
        '<$0.01',
      );
    });

    it('does not collapse total exactly at $0.01 boundary', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      const balances = [buildBalance(1n, 0.01)];

      expect(result.current.toDisplayAggregatedAmountUSD(balances)).toBe(
        'format.currency',
      );
    });

    it('returns localized currency key for normal totals', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      const balances = [buildBalance(1000000000000000000n, 2000)];

      expect(result.current.toDisplayAggregatedAmountUSD(balances)).toBe(
        'format.currency',
      );
    });

    it('respects compact option for normal totals', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      const balances = [buildBalance(1000000000000000000n, 2000)];

      expect(
        result.current.toDisplayAggregatedAmountUSD(balances, {
          compact: true,
        }),
      ).toBe('format.currencyCompact');
    });

    it('does not collapse zero total', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      const balances = [buildBalance(0n, 0)];

      expect(result.current.toDisplayAggregatedAmountUSD(balances)).toBe(
        'format.currency',
      );
    });

    it('sums multi-balance amountUSD and collapses if sub-cent', () => {
      const { result } = renderHook(() => usePortfolioFormatters());
      const balances = [buildBalance(1n, 0.001), buildBalance(2n, 0.002)];

      expect(result.current.toDisplayAggregatedAmountUSD(balances)).toBe(
        '<$0.01',
      );
    });
  });
});
