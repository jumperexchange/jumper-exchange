import { useMemo } from 'react';
import mapValues from 'lodash/mapValues';
import sumBy from 'lodash/sumBy';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import type {
  PortfolioPosition,
  SummaryData,
  BalancesByAddressSummary,
  PositionsByProtocolSummary,
} from '../types';
import { calcPercentage } from '../utils';
import type { PortfolioBalance, WalletToken } from '@/types/tokens';

interface UsePortfolioSummaryParams {
  balances: Record<string, PortfolioBalance<WalletToken>[]>;
  positions: PortfolioPosition[];
  positionsByProtocol: Record<string, PortfolioPosition[]>;
}

export const usePortfolioSummaryData = ({
  balances,
  positions,
  positionsByProtocol,
}: UsePortfolioSummaryParams): SummaryData => {
  return useMemo(() => {
    const allBalances = flatten(values(balances));
    const totalBalancesUsd = sumBy(allBalances, 'amountUSD');
    const totalPositionsUsd = sumBy(positions, 'netUsd');
    const totalPortfolioUsd = totalBalancesUsd + totalPositionsUsd;

    const balancesBySymbolSummary = mapValues(
      balances,
      (symbolBalances): BalancesByAddressSummary => {
        const totalUsd = sumBy(symbolBalances, 'amountUSD');
        return {
          balances: map(symbolBalances, (b) => ({
            ...b,
            percentage: calcPercentage(b.amountUSD, totalPortfolioUsd),
          })),
          totalUsd,
          percentage: calcPercentage(totalUsd, totalPortfolioUsd),
        };
      },
    );

    const positionsByProtocolSummary = mapValues(
      positionsByProtocol,
      (protocolPositions): PositionsByProtocolSummary => {
        const totalUsd = sumBy(protocolPositions, 'netUsd');
        return {
          positions: map(protocolPositions, (p) => ({
            ...p,
            percentage: calcPercentage(p.netUsd, totalPortfolioUsd),
          })),
          totalUsd,
          percentage: calcPercentage(totalUsd, totalPortfolioUsd),
        };
      },
    );

    return {
      totalBalancesUsd,
      totalPositionsUsd,
      totalPortfolioUsd,
      balancesBySymbol: balancesBySymbolSummary,
      positionsByProtocol: positionsByProtocolSummary,
    };
  }, [balances, positions, positionsByProtocol]);
};
