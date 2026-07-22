import type { Balance, PricedToken } from '@/types/tokens';
import {
  DUST_AMOUNT_THRESHOLD,
  DUST_USD_THRESHOLD,
  NBSP,
  formatTokenAmountWithDust,
  formatUSDWithDust,
} from '@/utils/formatNumbers';
import { formatTokenAmount, formatTokenPrice } from '@jumperexchange/widget';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface FormatAmountUSDOptions {
  compact?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export interface FormatAmountOptions {
  decimals?: number;
  compact?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  hideSymbol?: boolean;
}

export const useTokenFormatters = () => {
  const { t } = useTranslation();

  const toAmount = useCallback((balance: Balance<PricedToken>): string => {
    return formatTokenAmount(balance.amount, balance.token.decimals);
  }, []);

  const toAmountUSD = useCallback(
    (balance: Balance<PricedToken>): string => {
      return formatTokenPrice(
        toAmount(balance),
        balance.token.priceUSD.toString(),
      ).toString();
    },
    [toAmount],
  );

  const toDisplayAmountUSD = useCallback(
    (
      balance: Balance<PricedToken>,
      options: FormatAmountUSDOptions = {},
    ): string => {
      const value = Number(toAmountUSD(balance));
      if (value > 0 && value < DUST_USD_THRESHOLD) {
        return formatUSDWithDust(value, t);
      }
      if (options.compact) {
        return t('format.currencyCompact', { value });
      }

      const { compact, ...rest } = options;

      return t('format.currency', {
        value,
        ...rest,
      });
    },
    [t, toAmountUSD],
  );

  const toDisplayAmount = useCallback(
    (
      balance: Balance<PricedToken>,
      symbol?: string,
      options?: FormatAmountOptions,
    ): string => {
      const amount = toAmount(balance);
      const numeric = parseFloat(amount);
      if (numeric > 0 && numeric < DUST_AMOUNT_THRESHOLD) {
        return formatTokenAmountWithDust(amount, symbol ?? '', t, {
          hideSymbol: options?.hideSymbol,
        });
      }
      const formatted = t(
        `format.${options?.compact ? 'decimalCompact' : 'decimal'}`,
        {
          value: Number(amount),
          minimumFractionDigits: options?.minimumFractionDigits,
          maximumFractionDigits: options?.maximumFractionDigits ?? 3,
        },
      );
      if (options?.hideSymbol || !symbol) {
        return formatted;
      }
      return `${formatted}${NBSP}${symbol}`;
    },
    [t, toAmount],
  );

  return {
    toAmount,
    toAmountUSD,
    toDisplayAmountUSD,
    toDisplayAmount,
  };
};
