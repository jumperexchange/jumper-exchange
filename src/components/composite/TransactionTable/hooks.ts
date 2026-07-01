import { sumBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { createBaseToken } from '@/types/tokens';
import type { BalanceDto, NftDto, TokenDto } from '@/types/jumper-backend';
import type { NftBalance, PortfolioTransaction } from './types';
import { isNftDto, isTokenDto } from './types';
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
type BalanceWithNftDto = BalanceDto & { token: NftDto };

const hasTokenDto = (balance: BalanceDto): balance is BalanceWithTokenDto =>
  balance.token != null && isTokenDto(balance.token);

const hasNftDto = (balance: BalanceDto): balance is BalanceWithNftDto =>
  balance.token != null && isNftDto(balance.token);

const toNftBalance = (b: BalanceWithNftDto): NftBalance => ({
  address: b.token.address,
  chainId: b.token.chainId,
  tokenId: b.token.tokenId,
  amount: b.amount,
  amountUsd: b.amountUsd,
});

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
  const fromNfts = transaction.fromBalances.filter(hasNftDto).map(toNftBalance);
  const toNfts = transaction.toBalances.filter(hasNftDto).map(toNftBalance);

  const fromAmountTitle = fromBalances.length
    ? toDisplayAmountUSD(sumBy(fromBalances, 'amountUsd'))
    : '-';
  const fromAmountHint = fromBalances.length
    ? fromBalances
        .map((b) => toDisplayAmount(b.amount, b.token.symbol))
        .join('\n')
    : undefined;

  const toAmountTitle = toBalances.length
    ? toDisplayAmountUSD(sumBy(toBalances, 'amountUsd'))
    : '-';
  const toAmountHint = toBalances.length
    ? toBalances
        .map((b) => toDisplayAmount(b.amount, b.token.symbol))
        .join('\n')
    : undefined;

  return {
    fromAmountTitle,
    fromAmountHint,
    toAmountTitle,
    toAmountHint,
    actionTitle: formatTransactionAction(transaction.action),
    feeTitle:
      transaction.fee?.amountUsd != null
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
    fromNfts,
    toNfts,
  };
};
