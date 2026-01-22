import { PortfolioDeFiPositionsGroup } from '../types/PortfolioDeFiPositionsGroup';
import { PortfolioSummary } from '../types/PortfolioSummary';
import { map, orderBy, sumBy } from 'lodash';
import { PortfolioTokenGroup } from '../types/PortfolioTokenGroup';

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
