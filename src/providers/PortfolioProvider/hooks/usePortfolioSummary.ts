import { useMemo } from 'react';
import mapValues from 'lodash/mapValues';
import sumBy from 'lodash/sumBy';
import flatMap from 'lodash/flatMap';
import map from 'lodash/map';
import flatten from 'lodash/flatten';
import values from 'lodash/values';
import type {
  WalletPortfolioBalance,
  PortfolioPosition,
  SummaryData,
  BalancesByAddressSummary,
  PositionsByProtocolSummary,
} from '../types';
import { calcPercentage } from '../utils';

interface UsePortfolioSummaryParams {
  balancesByAddress: Record<string, Record<string, WalletPortfolioBalance[]>>;
  positions: PortfolioPosition[];
  positionsByProtocol: Record<string, PortfolioPosition[]>;
}

export const usePortfolioSummaryData = ({
  balancesByAddress,
  positions,
  positionsByProtocol,
}: UsePortfolioSummaryParams): SummaryData => {
  return useMemo(() => {
    const allBalances = flatMap(values(balancesByAddress), (grouped) =>
      flatten(values(grouped)),
    );
    const totalBalancesUsd = sumBy(allBalances, 'amountUSD');
    const totalPositionsUsd = sumBy(positions, 'netUsd');
    const totalPortfolioUsd = totalBalancesUsd + totalPositionsUsd;

    const balancesByAddressSummary = mapValues(
      balancesByAddress,
      (grouped): BalancesByAddressSummary => {
        const flatBalances = flatten(values(grouped));
        const totalUsd = sumBy(flatBalances, 'amountUSD');
        return {
          balances: map(flatBalances, (b) => ({
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
      balancesByAddress: balancesByAddressSummary,
      positionsByProtocol: positionsByProtocolSummary,
    };
  }, [balancesByAddress, positions, positionsByProtocol]);
};
