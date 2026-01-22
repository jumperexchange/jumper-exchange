import { map, orderBy, sumBy } from 'lodash';
import { PortfolioTokenGroup } from '../types/tokens';
import { PortfolioDeFiPositionsGroup } from '../types/positions';
import { PortfolioSummary } from '../types/summary';

export const computePercentage = (value: number, total: number): number => {
  return total > 0 ? (value / total) * 100 : 0;
};

export const processSummary = (
  tokenGroups: PortfolioTokenGroup[],
  positionGroups: PortfolioDeFiPositionsGroup[],
): PortfolioSummary => {
  const tokensAmountUSD = sumBy(tokenGroups, 'amountUSD');
  const positionsAmountUSD = sumBy(positionGroups, 'amountUSD');
  const totalAmountUSD = tokensAmountUSD + positionsAmountUSD;

  const tokensBySymbolSummary = orderBy(
    map(
      tokenGroups,
      (group) => new PortfolioTokenGroup(group.all, tokensAmountUSD),
    ),
    'amountUSD',
    'desc',
  );

  const positionsByProtocolSummary = orderBy(
    map(
      positionGroups,
      (group) => new PortfolioDeFiPositionsGroup(group.all, positionsAmountUSD),
    ),
    'amountUSD',
    'desc',
  );

  return new PortfolioSummary(
    totalAmountUSD,
    tokensAmountUSD,
    positionsAmountUSD,
    tokensBySymbolSummary,
    positionsByProtocolSummary,
  );
};
