import type { Balance, PricedToken } from '@/types/tokens';
import { formatTokenAmount, formatTokenPrice } from '@lifi/widget';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export interface FormatAmountUSDOptions {
  compact?: boolean;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export interface FormatAmountOptions {
  decimals?: number;
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
      const value = toAmountUSD(balance);
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
      symbol: string,
      _options?: FormatAmountOptions,
    ): string => {
      const amount = toAmount(balance);
      const formatted = t('format.decimal', { value: amount });
      return `${formatted} ${symbol}`;
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
