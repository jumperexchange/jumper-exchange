import type { PricedToken, PortfolioBalance } from '@/types/tokens';
import { formatTokenAmount } from '@lifi/widget';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import sumBy from 'lodash/sumBy';

export interface FormatAmountUSDOptions {
  compact?: boolean;
}

export interface FormatAmountOptions {
  decimals?: number;
}

export const usePortfolioFormatters = () => {
  const { t } = useTranslation();

  const toAggregatedAmount = useCallback(
    (balances: PortfolioBalance<PricedToken>[]): string => {
      if (balances.length === 0) {
        return '0';
      }
      if (balances.length === 1) {
        return formatTokenAmount(
          balances[0].amount,
          balances[0].token.decimals,
        );
      }
      const total = sumBy(balances, (balance) =>
        parseFloat(formatTokenAmount(balance.amount, balance.token.decimals)),
      );
      return total.toString();
    },
    [],
  );

  const toAggregatedAmountUSD = useCallback(
    (balances: PortfolioBalance<PricedToken>[]): number => {
      return sumBy(balances, 'amountUSD');
    },
    [],
  );

  const toDisplayAggregatedAmountUSD = useCallback(
    (
      balances: PortfolioBalance<PricedToken>[],
      options?: FormatAmountUSDOptions,
    ): string => {
      const totalAmountUSD = toAggregatedAmountUSD(balances);
      const formatKey = options?.compact
        ? 'format.currencyCompact'
        : 'format.currency';
      return t(formatKey, { value: totalAmountUSD });
    },
    [t, toAggregatedAmountUSD],
  );

  const toDisplayAggregatedAmount = useCallback(
    (balances: PortfolioBalance<PricedToken>[]): string => {
      const amount = toAggregatedAmount(balances);
      const formatted = t('format.decimal', { value: Number(amount) });
      return `${formatted} ${balances[0].token.symbol}`;
    },
    [t, toAggregatedAmount],
  );

  return {
    toAggregatedAmount,
    toAggregatedAmountUSD,
    toDisplayAggregatedAmountUSD,
    toDisplayAggregatedAmount,
  };
};
