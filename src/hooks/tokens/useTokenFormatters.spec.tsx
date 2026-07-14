import type { Balance, PricedToken } from '@/types/tokens';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NBSP } from '@/utils/formatNumbers';
import { useTokenFormatters } from './useTokenFormatters';

const buildBalance = (
  amount: bigint,
  overrides: Partial<PricedToken> = {},
): Balance<PricedToken> => ({
  amount,
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

describe('useTokenFormatters', () => {
  describe('toDisplayAmount', () => {
    it('collapses dust below threshold to <0.0001 SYMBOL', () => {
      const { result } = renderHook(() => useTokenFormatters());
      // 1 wei with 18 decimals = 0.000000000000000001
      const balance = buildBalance(1n);

      expect(
        result.current.toDisplayAmount(balance, balance.token.symbol),
      ).toBe(`<0.0001${NBSP}ETH`);
    });

    it('does not collapse amount exactly at the threshold boundary', () => {
      const { result } = renderHook(() => useTokenFormatters());
      // 1e14 wei with 18 decimals = 0.0001 exactly
      const balance = buildBalance(100000000000000n);

      // Above-threshold path goes through the localized format.decimal key
      // (mocked t returns the key as-is in tests).
      expect(
        result.current.toDisplayAmount(balance, balance.token.symbol),
      ).toBe(`format.decimal${NBSP}ETH`);
    });

    it('returns localized key + symbol for normal amounts', () => {
      const { result } = renderHook(() => useTokenFormatters());
      // 1e18 wei with 18 decimals = 1
      const balance = buildBalance(1000000000000000000n);

      expect(
        result.current.toDisplayAmount(balance, balance.token.symbol),
      ).toBe(`format.decimal${NBSP}ETH`);
    });

    it('does not collapse zero amount', () => {
      const { result } = renderHook(() => useTokenFormatters());
      const balance = buildBalance(0n);

      expect(
        result.current.toDisplayAmount(balance, balance.token.symbol),
      ).toBe(`format.decimal${NBSP}ETH`);
    });

    it('falls back to --- symbol when symbol is missing on dust path', () => {
      const { result } = renderHook(() => useTokenFormatters());
      const balance = buildBalance(1n, { symbol: '' });

      expect(result.current.toDisplayAmount(balance)).toBe(`<0.0001${NBSP}---`);
    });

    it('omits the symbol on dust path when hideSymbol is set', () => {
      const { result } = renderHook(() => useTokenFormatters());
      const balance = buildBalance(1n);

      expect(
        result.current.toDisplayAmount(balance, balance.token.symbol, {
          hideSymbol: true,
        }),
      ).toBe('<0.0001');
    });

    it('omits the symbol on normal path when hideSymbol is set', () => {
      const { result } = renderHook(() => useTokenFormatters());
      const balance = buildBalance(1000000000000000000n);

      expect(
        result.current.toDisplayAmount(balance, balance.token.symbol, {
          hideSymbol: true,
        }),
      ).toBe('format.decimal');
    });

    it('returns localized key without symbol when no symbol is provided on normal path', () => {
      const { result } = renderHook(() => useTokenFormatters());
      const balance = buildBalance(1000000000000000000n);

      expect(result.current.toDisplayAmount(balance)).toBe('format.decimal');
    });
  });

  describe('toDisplayAmountUSD', () => {
    it('collapses sub-cent USD to <$0.01', () => {
      const { result } = renderHook(() => useTokenFormatters());
      // 1e12 wei × $2000 / 1e18 = 0.000002 USD — below $0.01
      const balance = buildBalance(1000000000000n);

      expect(result.current.toDisplayAmountUSD(balance)).toBe('<$0.01');
    });

    it('does not collapse USD exactly at $0.01 boundary', () => {
      const { result } = renderHook(() => useTokenFormatters());
      // 5e12 wei × $2000 / 1e18 = 0.01 USD
      const balance = buildBalance(5000000000000n);

      expect(result.current.toDisplayAmountUSD(balance)).toBe(
        'format.currency',
      );
    });

    it('returns localized currency key for normal USD amounts', () => {
      const { result } = renderHook(() => useTokenFormatters());
      // 1e18 wei × $2000 / 1e18 = 2000 USD
      const balance = buildBalance(1000000000000000000n);

      expect(result.current.toDisplayAmountUSD(balance)).toBe(
        'format.currency',
      );
    });

    it('respects compact option for normal USD amounts', () => {
      const { result } = renderHook(() => useTokenFormatters());
      const balance = buildBalance(1000000000000000000n);

      expect(
        result.current.toDisplayAmountUSD(balance, { compact: true }),
      ).toBe('format.currencyCompact');
    });

    it('does not collapse zero USD', () => {
      const { result } = renderHook(() => useTokenFormatters());
      const balance = buildBalance(0n);

      expect(result.current.toDisplayAmountUSD(balance)).toBe(
        'format.currency',
      );
    });
  });
});
