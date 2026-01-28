import type { TokenBalance } from '@/types/tokens';
import { formatTokenAmount, formatTokenPrice } from '@lifi/widget';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface FormatAmountUSDOptions {
  compact?: boolean;
}

export interface FormatAmountOptions {
  decimals?: number;
}

export const useTokenFormatters = () => {
  const { t } = useTranslation();

  const toAmount = useCallback((balance: TokenBalance): string => {
    return formatTokenAmount(balance.amount, balance.token.decimals);
  }, []);

  const toAmountUSD = useCallback(
    (balance: TokenBalance): string => {
      return formatTokenPrice(
        toAmount(balance),
        balance.token.priceUSD.toString(),
      ).toString();
    },
    [toAmount],
  );

  const toDisplayAmountUSD = useCallback(
    (balance: TokenBalance, options?: FormatAmountUSDOptions): string => {
      const value = toAmountUSD(balance);
      const formatKey = options?.compact
        ? 'format.currencyCompact'
        : 'format.currency';
      return t(formatKey, { value });
    },
    [t, toAmountUSD],
  );

  const toDisplayAmount = useCallback(
    (
      balance: TokenBalance,
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
