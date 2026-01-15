import type { PortfolioToken } from '@/types/tokens';
import type { AugmentedPosition } from './positions.augment';
import { map, orderBy, sumBy } from 'lodash';
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
  positions: AugmentedPosition[],
  totalPositionsValueUSD: number,
): PortfolioPositionSummary => {
  const totalValueUSD = sumBy(positions, 'netUsd');
  const percentageOfTotalValueUSD = calculatePercentage(
    totalValueUSD,
    totalPositionsValueUSD,
  );
  return {
    protocol: positions[0]?.protocol,
    chain: positions[0]?.chain,
    name: positions[0]?.name,
    address: positions[0]?.address,
    totalValueUSD,
    formattedTotalValueUSD: formatTotalValue(totalValueUSD),
    percentageOfTotalValueUSD,
  };
};

export const processSummary = (
  tokens: PortfolioToken[],
  positionsByProtocol: Record<string, AugmentedPosition[]>,
) => {
  const positionsByProtocolValues = Object.values(positionsByProtocol);
  const tokensValueUSD = sumBy(tokens, 'totalPriceUSD');
  const positionsValueUSD = sumBy(positionsByProtocolValues.flat(), 'netUsd');
  const totalValueUSD = tokensValueUSD + positionsValueUSD;
  const tokensBySymbolSummary = orderBy(
    map(tokens, (token) => toTokenSummary(token, tokensValueUSD)),
    'totalValueUSD',
    'desc',
  );
  const positionsByProtocolSummary = orderBy(
    map(positionsByProtocolValues, (positions) =>
      toPositionSummary(positions, positionsValueUSD),
    ),
    'totalValueUSD',
    'desc',
  );

  return {
    totalValueUSD,
    formattedTotalValueUSD: formatTotalValue(totalValueUSD),
    positionsValueUSD,
    formattedPositionsValueUSD: formatTotalValue(positionsValueUSD),
    tokensValueUSD,
    formattedTokensValueUSD: formatTotalValue(tokensValueUSD),
    tokensBySymbol: tokensBySymbolSummary,
    positionsByProtocol: positionsByProtocolSummary,
  };
};
