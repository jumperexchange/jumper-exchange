import type { PricedToken, PortfolioBalance } from '@/types/tokens';
import {
  DUST_AMOUNT_THRESHOLD,
  DUST_USD_THRESHOLD,
  NBSP,
  formatTokenAmountWithDust,
  formatUSDWithDust,
} from '@/utils/formatNumbers';
import { formatTokenAmount } from '@jumperexchange/widget';
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
      if (totalAmountUSD > 0 && totalAmountUSD < DUST_USD_THRESHOLD) {
        return formatUSDWithDust(totalAmountUSD, t);
      }
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
      const numeric = Number(amount);
      const symbol = balances[0].token.symbol;
      if (numeric > 0 && numeric < DUST_AMOUNT_THRESHOLD) {
        return formatTokenAmountWithDust(amount, symbol, t);
      }
      const formatted = t('format.decimal', { value: numeric });
      return `${formatted}${NBSP}${symbol}`;
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
