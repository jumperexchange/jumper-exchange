import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface FormatAmountUSDOptions {
  compact?: boolean;
}

export interface FormatAmountOptions {
  decimals?: number;
}

export interface PortfolioFormatters {
  amountUSD: (value: number, options?: FormatAmountUSDOptions) => string;
  amount: (
    value: number,
    symbol: string,
    options?: FormatAmountOptions,
  ) => string;
  percentage: (value: number) => string;
  decimal: (value: number) => string;
}

export const usePortfolioFormattersInternal = (): PortfolioFormatters => {
  const { t } = useTranslation();

  const amountUSD = useCallback(
    (value: number, options?: FormatAmountUSDOptions): string => {
      const formatKey = options?.compact
        ? 'format.currencyCompact'
        : 'format.currency';
      return t(formatKey, { value });
    },
    [t],
  );

  const amount = useCallback(
    (value: number, symbol: string, _options?: FormatAmountOptions): string => {
      const formatted = t('format.decimal', { value });
      return `${formatted} ${symbol}`;
    },
    [t],
  );

  const percentage = useCallback(
    (value: number): string => {
      return t('format.decimal2Digit', { value }) + '%';
    },
    [t],
  );

  const decimal = useCallback(
    (value: number): string => {
      return t('format.decimal', { value });
    },
    [t],
  );

  return useMemo(
    () => ({
      amountUSD,
      amount,
      percentage,
      decimal,
    }),
    [amountUSD, amount, percentage, decimal],
  );
};
