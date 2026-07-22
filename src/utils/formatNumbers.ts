import type { TFunction } from 'i18next';

export const decimalFormatter = (
  lng: string | undefined,
  options: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'decimal',
  });

  return (value: any) => {
    if (!value) {
      return formatter.format(0);
    }

    return formatter.format(value);
  };
};

export const percentFormatter = (
  lng: string | undefined,
  options: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (value: any) => {
    if (!value) {
      return formatter.format(0);
    }

    return formatter.format(value);
  };
};

export const currencyFormatter = (
  lng: string | undefined,
  options: Intl.NumberFormatOptions,
) => {
  const formatter = new Intl.NumberFormat(lng, {
    ...options,
    style: 'currency',
  });

  return (value: any) => {
    if (!value) {
      return formatter.format(0);
    }

    return formatter.format(value);
  };
};

export const toFixedFractionDigits = (
  value: number,
  minFractionDigits: number,
  maxFractionDigits: number,
  notation: 'standard' | 'compact' = 'compact',
) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: minFractionDigits,
    maximumFractionDigits: maxFractionDigits,
    notation: notation,
  }).format(value);
};

export const toCompactValue = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

export interface ValueFormatConfig {
  type: 'percentage' | 'currency' | 'compact' | 'decimal';
  options?: Intl.NumberFormatOptions;
}

export const formatValueWithConfig = (
  value: number | string,
  config: ValueFormatConfig,
  options?: { includePrefixSuffix?: boolean } & Intl.NumberFormatOptions,
): string => {
  const numValue = Number(value);

  if (isNaN(numValue)) {
    return value.toString();
  }

  const includePrefixSuffix = options?.includePrefixSuffix ?? true;
  const formatOptions: Intl.NumberFormatOptions = { ...config.options };

  switch (config.type) {
    case 'percentage':
      formatOptions.style = includePrefixSuffix ? 'percent' : 'decimal';
      return new Intl.NumberFormat('en-US', formatOptions).format(
        includePrefixSuffix ? numValue : numValue * 100,
      );

    case 'currency':
      formatOptions.style = includePrefixSuffix ? 'currency' : 'decimal';
      formatOptions.currency = 'USD';
      formatOptions.notation = 'compact';
      formatOptions.compactDisplay = 'short';
      formatOptions.trailingZeroDisplay = 'stripIfInteger';
      break;

    case 'compact':
      formatOptions.notation = 'compact';
      formatOptions.compactDisplay = 'short';
      break;

    case 'decimal':
      formatOptions.style = 'decimal';
      break;
  }

  return new Intl.NumberFormat('en-US', formatOptions).format(numValue);
};

export const NBSP = '\u00a0'; // non-breaking space

export const DUST_AMOUNT_THRESHOLD = 0.0001;
export const DUST_AMOUNT_LABEL = `<${DUST_AMOUNT_THRESHOLD}`;

export interface FormatTokenAmountWithDustOptions {
  /**
   * Omit the symbol entirely instead of falling back to the `---`
   * placeholder. Use when the symbol is known but intentionally shown
   * elsewhere in the UI, as opposed to a genuinely unknown symbol.
   */
  hideSymbol?: boolean;
}

/**
 * Combines a formatted decimal `amount` string with a token `symbol`,
 * collapsing non-zero values below the dust threshold to `<0.0001 SYMBOL`
 * so positions don't render as long decimals like `0.000000000000000001 eETH`.
 * The collapsed label is locale-aware via `format.dustAmount`; falls back to
 * the en-US literal when i18next hasn't been initialised yet (e.g. tests).
 */
export const formatTokenAmountWithDust = (
  amount: string,
  symbol: string,
  t?: TFunction,
  options?: FormatTokenAmountWithDustOptions,
): string => {
  const numeric = parseFloat(amount);
  const isDust = numeric > 0 && numeric < DUST_AMOUNT_THRESHOLD;

  if (options?.hideSymbol) {
    if (!isDust) {
      return amount;
    }
    const translated = t?.('format.dustAmountValue', {
      value: DUST_AMOUNT_THRESHOLD,
    });
    return !translated || translated.startsWith('format.dustAmountValue')
      ? DUST_AMOUNT_LABEL
      : translated;
  }

  const label = symbol || '---';
  if (isDust) {
    const translated = t?.('format.dustAmount', {
      value: DUST_AMOUNT_THRESHOLD,
      symbol: label,
    });
    return !translated || translated.startsWith('format.dustAmount')
      ? `${DUST_AMOUNT_LABEL}${NBSP}${label}`
      : translated;
  }
  return `${amount}${NBSP}${label}`;
};

export const formatUSD = currencyFormatter('en-US', {
  notation: 'compact',
  currency: 'USD',
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const DUST_USD_THRESHOLD = 0.01;
export const DUST_USD_LABEL = '<$0.01';

/**
 * Wraps `formatUSD` and collapses any positive USD value below $0.01 to
 * `<$0.01`. Mirrors `formatTokenAmountWithDust` on the dollar axis, scoped
 * to position UIs where sub-cent values are noise.
 * The collapsed label is locale-aware via `format.dustUsd`; falls back to
 * the en-US literal when i18next hasn't been initialised yet (e.g. tests).
 */
export const formatUSDWithDust = (
  amountUSD: number | string,
  t?: TFunction,
): string => {
  const numeric =
    typeof amountUSD === 'number' ? amountUSD : parseFloat(amountUSD as string);
  if (Number.isFinite(numeric) && numeric > 0 && numeric < DUST_USD_THRESHOLD) {
    const translated = t?.('format.dustUsd', {
      value: DUST_USD_THRESHOLD,
    });
    return !translated || translated.startsWith('format.dustUsd')
      ? DUST_USD_LABEL
      : translated;
  }
  return formatUSD(amountUSD ?? 0);
};
