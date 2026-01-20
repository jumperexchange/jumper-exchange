import type { PortfolioToken } from '@/types/tokens';
import type { EnrichedPosition } from '../types/positions.types';
import { sumBy } from 'lodash';
import type { PortfolioTokenSummary } from '../types/tokens.types';
import type { PortfolioPositionSummary } from '../types/positions.types';

const formatTotalValue = (value: number): string => {
  return value.toFixed(2) + ' USD';
};

const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) {
    return 0;
  }
  return (value / total) * 100;
};

export const toTokenSummary = (
  token: PortfolioToken,
  totalTokensValueUSD: number,
): PortfolioTokenSummary => {
  const percentageOfTotalValueUSD = calculatePercentage(
    token.totalPriceUSD,
    totalTokensValueUSD,
  );
  return {
    ...token,
    balance: token.balance,
    totalValueUSD: token.totalPriceUSD,
    formattedTotalValueUSD: formatTotalValue(token.totalPriceUSD),
    formattedBalance: formatTotalValue(token.balance),
    percentageOfTotalValueUSD,
  };
};

export const toPositionSummary = (
  positions: EnrichedPosition[],
  totalPositionsValueUSD: number,
): PortfolioPositionSummary => {
  const totalValueUSD = sumBy(positions, 'netUsd');
  const percentageOfTotalValueUSD = calculatePercentage(
    totalValueUSD,
    totalPositionsValueUSD,
  );
  return {
    ...positions[0],
    totalValueUSD,
    formattedTotalValueUSD: formatTotalValue(totalValueUSD),
    percentageOfTotalValueUSD,
  };
};

export const processSummary = (
  tokens: PortfolioToken[],
  positionsByProtocol: Record<string, EnrichedPosition[]>,
) => {
  const positionsByProtocolValues = Object.values(positionsByProtocol);
  const tokensValueUSD = sumBy(tokens, 'totalPriceUSD');
  const positionsValueUSD = sumBy(positionsByProtocolValues.flat(), 'netUsd');
  const totalValueUSD = tokensValueUSD + positionsValueUSD;
  return {
    totalValueUSD,
    formattedTotalValueUSD: formatTotalValue(totalValueUSD),
    positionsValueUSD,
    formattedPositionsValueUSD: formatTotalValue(positionsValueUSD),
    tokensValueUSD,
    formattedTokensValueUSD: formatTotalValue(tokensValueUSD),
    tokensBySymbol: tokens.map((token) =>
      toTokenSummary(token, tokensValueUSD),
    ),
    positionsByProtocol: positionsByProtocolValues.map((position) =>
      toPositionSummary(position, positionsValueUSD),
    ),
  };
};
