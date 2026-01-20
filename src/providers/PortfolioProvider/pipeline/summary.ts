import type {
  PortfolioPositionSummary,
  EnrichedPosition,
} from '../types/positions.types';
import { sumBy } from 'lodash';
import type {
  PortfolioTokenSummary,
  PortfolioToken,
} from '../types/tokens.types';

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
  const percentageOfTotalAmountUSD = calculatePercentage(
    token.amountUSD,
    totalTokensValueUSD,
  );
  return {
    ...token,
    formattedAmountUSD: formatTotalValue(token.amountUSD),
    formattedAmount: formatTotalValue(token.amount),
    percentageOfTotalAmountUSD,
  };
};

export const toPositionSummary = (
  positions: EnrichedPosition[],
  totalPositionsValueUSD: number,
): PortfolioPositionSummary => {
  const amountUSD = sumBy(positions, 'netUsd');
  const percentageOfTotalAmountUSD = calculatePercentage(
    amountUSD,
    totalPositionsValueUSD,
  );
  return {
    ...positions[0],
    amountUSD,
    formattedAmountUSD: formatTotalValue(amountUSD),
    percentageOfTotalAmountUSD,
  };
};

export const processSummary = (
  tokens: PortfolioToken[],
  positionsByProtocol: Record<string, EnrichedPosition[]>,
) => {
  const positionsByProtocolValues = Object.values(positionsByProtocol);
  const tokensAmountUSD = sumBy(tokens, 'amountUSD');
  const positionsAmountUSD = sumBy(positionsByProtocolValues.flat(), 'netUsd');
  const totalAmountUSD = tokensAmountUSD + positionsAmountUSD;
  return {
    totalAmountUSD,
    formattedTotalAmountUSD: formatTotalValue(totalAmountUSD),
    positionsAmountUSD,
    formattedPositionsAmountUSD: formatTotalValue(positionsAmountUSD),
    tokensAmountUSD,
    formattedTokensAmountUSD: formatTotalValue(tokensAmountUSD),
    tokensBySymbol: tokens.map((token) =>
      toTokenSummary(token, tokensAmountUSD),
    ),
    positionsByProtocol: positionsByProtocolValues.map((position) =>
      toPositionSummary(position, positionsAmountUSD),
    ),
  };
};
