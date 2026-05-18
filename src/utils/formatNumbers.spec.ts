import { describe, expect, it } from 'vitest';
import {
  formatTokenAmountWithDust,
  formatUSDWithDust,
  formatValueWithConfig,
} from './formatNumbers';
import { APY_FORMAT_CONFIG } from './numbers/apy';

describe('formatTokenAmountWithDust', () => {
  it('should collapse dust amount to <0.0001 SYMBOL', () => {
    expect(formatTokenAmountWithDust('0.000000000000000001', 'eETH')).toBe(
      '<0.0001 eETH',
    );
  });

  it('should not collapse amount exactly at boundary', () => {
    expect(formatTokenAmountWithDust('0.0001', 'eETH')).toBe('0.0001 eETH');
  });

  it('should not collapse zero', () => {
    expect(formatTokenAmountWithDust('0', 'eETH')).toBe('0 eETH');
  });

  it('should not collapse normal amount', () => {
    expect(formatTokenAmountWithDust('12.345', 'eETH')).toBe('12.345 eETH');
  });

  it('should use --- fallback for missing symbol on normal amount', () => {
    expect(formatTokenAmountWithDust('1', '')).toBe('1 ---');
  });

  it('should use --- fallback for missing symbol on dust amount', () => {
    expect(formatTokenAmountWithDust('0.000000000000000001', '')).toBe(
      '<0.0001 ---',
    );
  });
});

describe('formatUSDWithDust', () => {
  it('should collapse sub-cent amount to <$0.01', () => {
    expect(formatUSDWithDust(0.001)).toBe('<$0.01');
  });

  it('should collapse sub-cent string amount to <$0.01', () => {
    expect(formatUSDWithDust('0.005')).toBe('<$0.01');
  });

  it('should not collapse zero', () => {
    expect(formatUSDWithDust(0)).toBe('$0.00');
  });

  it('should not collapse amount exactly at boundary', () => {
    expect(formatUSDWithDust(0.01)).toBe('$0.01');
  });

  it('should not collapse normal amount', () => {
    expect(formatUSDWithDust(12.34)).toBe('$12.34');
  });

  it('should treat empty string as zero', () => {
    expect(formatUSDWithDust('')).toBe('$0.00');
  });
});

describe('formatValueWithConfig', () => {
  describe('with APY_FORMAT_CONFIG', () => {
    it('should format 0.02 as 2%', () => {
      expect(formatValueWithConfig(0.02, APY_FORMAT_CONFIG)).toBe('2%');
    });

    it('should format 0.1234 as 12.34%', () => {
      expect(formatValueWithConfig(0.1234, APY_FORMAT_CONFIG)).toBe('12.34%');
    });

    it('should format 0.12345 with max 2 fraction digits as 12.35%', () => {
      expect(formatValueWithConfig(0.12345, APY_FORMAT_CONFIG)).toBe('12.35%');
    });

    it('should format 0 as 0', () => {
      expect(formatValueWithConfig(0, APY_FORMAT_CONFIG)).toBe('0%');
    });

    it('should format 1 as 100%', () => {
      expect(formatValueWithConfig(1, APY_FORMAT_CONFIG)).toBe('100%');
    });
  });
});
