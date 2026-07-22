import { createInstance } from 'i18next';
import { describe, expect, it } from 'vitest';
import {
  NBSP,
  currencyFormatter,
  decimalFormatter,
  formatTokenAmountWithDust,
  formatUSDWithDust,
  formatValueWithConfig,
} from './formatNumbers';
import { APY_FORMAT_CONFIG } from './numbers/apy';

async function buildFrT() {
  const i18n = createInstance();
  await i18n.init({
    lng: 'fr',
    resources: {
      fr: {
        translation: {
          format: {
            dustAmount: `<{{value, decimalExt(maximumFractionDigits: 4)}}${NBSP}{{symbol}}`,
            dustAmountValue: `<{{value, decimalExt(maximumFractionDigits: 4)}}`,
            dustUsd: '<{{value, currencyExt(currency: USD)}}',
          },
        },
      },
    },
    defaultNS: 'translation',
    ns: ['translation'],
  });
  i18n.services.formatter?.addCached('decimalExt', decimalFormatter);
  i18n.services.formatter?.addCached('currencyExt', currencyFormatter);
  return i18n.t.bind(i18n);
}

describe('formatTokenAmountWithDust', () => {
  it('should collapse dust amount to <0.0001 SYMBOL', () => {
    expect(formatTokenAmountWithDust('0.000000000000000001', 'eETH')).toBe(
      `<0.0001${NBSP}eETH`,
    );
  });

  it('should not collapse amount exactly at boundary', () => {
    expect(formatTokenAmountWithDust('0.0001', 'eETH')).toBe(
      `0.0001${NBSP}eETH`,
    );
  });

  it('should not collapse zero', () => {
    expect(formatTokenAmountWithDust('0', 'eETH')).toBe(`0${NBSP}eETH`);
  });

  it('should not collapse normal amount', () => {
    expect(formatTokenAmountWithDust('12.345', 'eETH')).toBe(
      `12.345${NBSP}eETH`,
    );
  });

  it('should use --- fallback for missing symbol on normal amount', () => {
    expect(formatTokenAmountWithDust('1', '')).toBe(`1${NBSP}---`);
  });

  it('should use --- fallback for missing symbol on dust amount', () => {
    expect(formatTokenAmountWithDust('0.000000000000000001', '')).toBe(
      `<0.0001${NBSP}---`,
    );
  });

  it('should omit the symbol on dust amount when hideSymbol is set', () => {
    expect(
      formatTokenAmountWithDust('0.000000000000000001', 'eETH', undefined, {
        hideSymbol: true,
      }),
    ).toBe('<0.0001');
  });

  it('should return the bare amount on normal amounts when hideSymbol is set', () => {
    expect(
      formatTokenAmountWithDust('12.345', 'eETH', undefined, {
        hideSymbol: true,
      }),
    ).toBe('12.345');
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

describe('formatTokenAmountWithDust with fr locale', () => {
  it('renders dust amount with fr decimal separator when t is provided', async () => {
    const t = await buildFrT();
    const result = formatTokenAmountWithDust(
      '0.000000000000000001',
      'WAVAX',
      t,
    );
    expect(result).toBe(`<0,0001${NBSP}WAVAX`);
  });

  it('falls back to en-US literal when t is omitted', () => {
    expect(formatTokenAmountWithDust('0.000000000000000001', 'WAVAX')).toBe(
      `<0.0001${NBSP}WAVAX`,
    );
  });

  it('renders dust value with fr decimal separator when hideSymbol is set', async () => {
    const t = await buildFrT();
    const result = formatTokenAmountWithDust(
      '0.000000000000000001',
      'WAVAX',
      t,
      { hideSymbol: true },
    );
    expect(result).toBe('<0,0001');
  });
});

describe('formatUSDWithDust with fr locale', () => {
  it('renders dust USD with fr locale formatting when t is provided', async () => {
    const t = await buildFrT();
    const result = formatUSDWithDust(0.001, t);
    expect(result).toBe(`<0,01${NBSP}$US`);
  });

  it('falls back to en-US literal when t is omitted', () => {
    expect(formatUSDWithDust(0.001)).toBe('<$0.01');
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
