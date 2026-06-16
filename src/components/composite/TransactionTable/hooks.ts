import { sumBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { createBaseToken } from '@/types/tokens';
import type { BalanceDto, TokenDto } from '@/types/jumper-backend';
import type { PortfolioTransaction } from './types';
import { isTokenDto } from './types';
import {
  formatTransactionAction,
  formatTransactionDateHint,
  formatTransactionDateTitle,
} from './utils';
import type { CoinKey } from '@lifi/sdk';

interface UseTransactionSummaryContentOptions {
  compact?: boolean;
}

type BalanceWithTokenDto = BalanceDto & { token: TokenDto };

const hasTokenDto = (balance: BalanceDto): balance is BalanceWithTokenDto =>
  balance.token != null && isTokenDto(balance.token);

const getTokenLogo = (logo: unknown): string | undefined => {
  if (logo instanceof URL) {
    return logo.href;
  }
  if (typeof logo === 'string') {
    return logo;
  }
  return undefined;
};

const toBaseToken = (token: TokenDto) =>
  createBaseToken({
    ...token,
    coinKey: (token.coinKey as CoinKey) ?? undefined,
    logoURI: getTokenLogo(token.logoURI),
  });

export const useTransactionSummaryContent = (
  transaction: PortfolioTransaction,
  { compact = false }: UseTransactionSummaryContentOptions = {},
) => {
  const { t } = useTranslation();

  const toDisplayAmount = (amount: number, symbol: string): string => {
    if (amount > 0 && amount < 0.01) {
      return `< 0.01 ${symbol}`;
    }
    const formatted = t('format.decimal', {
      value: Number(amount),
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    });
    if (!symbol) {
      return formatted;
    }
    return `${formatted} ${symbol}`;
  };

  const toDisplayAmountUSD = (amountUsd: number): string => {
    if (amountUsd > 0 && amountUsd < 0.01) {
      return '< $0.01';
    }
    return t(compact ? 'format.currencyCompact' : 'format.currency', {
      value: amountUsd,
    });
  };

  const toBalances = transaction.toBalances.filter(hasTokenDto);
  const fromBalances = transaction.fromBalances.filter(hasTokenDto);

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
      transaction.fee?.amountUsd !== null
        ? toDisplayAmountUSD(transaction.fee?.amountUsd ?? 0)
        : '-',
    feeHint:
      transaction.fee !== null &&
      transaction.fee.token != null &&
      isTokenDto(transaction.fee.token)
        ? toDisplayAmount(transaction.fee.amount, transaction.fee.token.symbol)
        : undefined,
    dateTitle: formatTransactionDateTitle(transaction.time),
    dateHint: formatTransactionDateHint(transaction.time),
    fromTokens: fromBalances.map((b) => toBaseToken(b.token)),
    toTokens: toBalances.map((b) => toBaseToken(b.token)),
  };
};
