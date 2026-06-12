import { sumBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { createBaseToken } from '@/types/tokens';
import type { BalanceDto } from '@/types/jumper-backend';
import type { PortfolioTransaction } from './types';
import {
  formatTransactionAction,
  formatTransactionDateHint,
  formatTransactionDateTitle,
} from './utils';

interface UseTransactionSummaryContentOptions {
  compact?: boolean;
}

type BalanceWithToken = BalanceDto & {
  token: NonNullable<BalanceDto['token']>;
};

const hasToken = (balance: BalanceDto): balance is BalanceWithToken =>
  balance.token !== null;

const toDisplayAmount = (amount: number, symbol: string): string => {
  if (amount > 0 && amount < 0.01) {
    return `< 0.01 ${symbol}`;
  }
  return `${amount} ${symbol}`;
};

export const useTransactionSummaryContent = (
  transaction: PortfolioTransaction,
  { compact = false }: UseTransactionSummaryContentOptions = {},
) => {
  const { t } = useTranslation();

  const toDisplayAmountUSD = (amountUsd: number): string => {
    if (amountUsd > 0 && amountUsd < 0.01) {
      return '< $0.01';
    }
    return t(compact ? 'format.currencyCompact' : 'format.currency', {
      value: amountUsd,
    });
  };

  const toBalances = transaction.toBalances.filter(hasToken);
  const fromBalances = transaction.fromBalances.filter(hasToken);

  // Sends have no incoming balances — show what was sent instead of $0.
  const amountBalances = toBalances.length ? toBalances : fromBalances;
  const amountTitle = toDisplayAmountUSD(sumBy(amountBalances, 'amountUsd'));
  const amountHint = amountBalances
    .map((b) => toDisplayAmount(b.amount, b.token.symbol))
    .join('\n');

  return {
    amountTitle,
    amountHint: amountHint || undefined,
    actionTitle: formatTransactionAction(transaction.action),
    feeTitle:
      transaction.feeUsd !== null
        ? toDisplayAmountUSD(transaction.feeUsd)
        : '-',
    feeHint:
      transaction.fee !== null
        ? toDisplayAmount(transaction.fee, transaction.feeToken.symbol)
        : undefined,
    dateTitle: formatTransactionDateTitle(transaction.time),
    dateHint: formatTransactionDateHint(transaction.time),
    fromTokens: fromBalances.map((b) => createBaseToken(b.token)),
    toTokens: toBalances.map((b) => createBaseToken(b.token)),
  };
};

export type TransactionSummaryContent = ReturnType<
  typeof useTransactionSummaryContent
>;
