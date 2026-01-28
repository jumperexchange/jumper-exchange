import type {
  Balance,
  BaseDisplayToken,
  PortfolioBalance,
} from '@/types/tokens';
import { formatTokenAmount, formatTokenPrice } from '@lifi/widget';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import sumBy from 'lodash/sumBy';

type FormattableBalance = Balance<BaseDisplayToken>;

type AggregableBalance = PortfolioBalance<BaseDisplayToken>;

export interface FormatAmountUSDOptions {
  compact?: boolean;
}

export interface FormatAmountOptions {
  decimals?: number;
}

export const useTokenFormatters = () => {
  const { t } = useTranslation();

  const toAmount = useCallback((balance: FormattableBalance): string => {
    return formatTokenAmount(balance.amount, balance.token.decimals);
  }, []);

  const toAmountUSD = useCallback(
    (balance: FormattableBalance): string => {
      return formatTokenPrice(
        toAmount(balance),
        balance.token.priceUSD.toString(),
      ).toString();
    },
    [toAmount],
  );

  const toDisplayAmountUSD = useCallback(
    (balance: FormattableBalance, options?: FormatAmountUSDOptions): string => {
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
      balance: FormattableBalance,
      symbol: string,
      _options?: FormatAmountOptions,
    ): string => {
      const amount = toAmount(balance);
      const formatted = t('format.decimal', { value: amount });
      return `${formatted} ${symbol}`;
    },
    [t, toAmount],
  );

  const toDisplayUSD = useCallback(
    (value: number, options?: FormatAmountUSDOptions): string => {
      const formatKey = options?.compact
        ? 'format.currencyCompact'
        : 'format.currency';
      return t(formatKey, { value });
    },
    [t],
  );

  const toAggregatedAmount = useCallback(
    (balances: AggregableBalance[]): string => {
      if (balances.length === 0) {
        return '0';
      }
      if (balances.length === 1) {
        return toAmount(balances[0]);
      }
      const total = balances.reduce((sum, balance) => {
        const normalized = formatTokenAmount(
          balance.amount,
          balance.token.decimals,
        );
        return sum + parseFloat(normalized);
      }, 0);
      return total.toString();
    },
    [toAmount],
  );

  const toAggregatedAmountUSD = useCallback(
    (balances: AggregableBalance[]): number => {
      return sumBy(balances, 'amountUSD');
    },
    [],
  );

  const toDisplayAggregatedAmountUSD = useCallback(
    (
      balances: AggregableBalance[],
      options?: FormatAmountUSDOptions,
    ): string => {
      const totalAmountUSD = toAggregatedAmountUSD(balances);
      return toDisplayUSD(totalAmountUSD, options);
    },
    [toAggregatedAmountUSD, toDisplayUSD],
  );

  const toDisplayAggregatedAmount = useCallback(
    (balances: AggregableBalance[], symbol: string): string => {
      const amount = toAggregatedAmount(balances);
      const formatted = t('format.decimal', { value: amount });
      return `${formatted} ${symbol}`;
    },
    [t, toAggregatedAmount],
  );

  return {
    toAmount,
    toAmountUSD,
    toDisplayAmountUSD,
    toDisplayAmount,
    toDisplayUSD,
    toAggregatedAmount,
    toAggregatedAmountUSD,
    toDisplayAggregatedAmountUSD,
    toDisplayAggregatedAmount,
  };
};
