import { TokenBalance } from '@/types/tokens';
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

  const toFormatAmount = useCallback((balance: TokenBalance): string => {
    return formatTokenAmount(balance.amount, balance.token.decimals);
  }, []);

  const toFormatAmountUSD = useCallback(
    (balance: TokenBalance): string => {
      return formatTokenPrice(
        toFormatAmount(balance),
        balance.token.priceUSD.toString(),
      ).toString();
    },
    [toFormatAmount],
  );

  const toDisplayAmountUSD = useCallback(
    (balance: TokenBalance, options?: FormatAmountUSDOptions): string => {
      const value = toFormatAmountUSD(balance);
      const formatKey = options?.compact
        ? 'format.currencyCompact'
        : 'format.currency';
      return t(formatKey, { value });
    },
    [t, toFormatAmountUSD],
  );

  const toDisplayAmount = useCallback(
    (
      balance: TokenBalance,
      symbol: string,
      _options?: FormatAmountOptions,
    ): string => {
      const amount = toFormatAmount(balance);
      const formatted = t('format.decimal', { value: amount });
      return `${formatted} ${symbol}`;
    },
    [t, toFormatAmount],
  );

  return {
    amountUSD: toDisplayAmountUSD,
    amount: toDisplayAmount,
  };
};
