import orderBy from 'lodash/orderBy';
import type { SummaryData } from '@/providers/PortfolioProvider/types';
import type { TokenSummary, ProtocolSummary } from './types';
import { values } from 'lodash';

export const getSortedTokenSummaries = (
  summaryData: SummaryData,
): TokenSummary[] => {
  const tokenSummaries = values(summaryData.balancesBySymbol).map(
    (summary) => ({
      token: summary.balances[0]?.token,
      totalUsd: summary.totalUsd,
      percentage: summary.percentage,
    }),
  );
  return orderBy(tokenSummaries, 'totalUsd', 'desc');
};

export const getSortedProtocolSummaries = (
  summaryData: SummaryData,
): ProtocolSummary[] => {
  const summaries = values(summaryData.positionsByProtocol).map((summary) => ({
    protocol: summary.positions[0]?.protocol,
    totalUsd: summary.totalUsd,
    percentage: summary.percentage,
  }));
  return orderBy(summaries, 'totalUsd', 'desc');
};
