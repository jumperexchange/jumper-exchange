import { PortfolioDeFiPositionsGroup } from '../classes/PortfolioDeFiPositionsGroup';
import { map, orderBy, sumBy } from 'lodash';
import { PortfolioTokenGroup } from '../classes/PortfolioTokenGroup';

export const processSummary = (
  tokenGroups: PortfolioTokenGroup[],
  positionGroups: PortfolioDeFiPositionsGroup[],
) => {
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

  return {
    totalAmountUSD,
    positionsAmountUSD,
    tokensAmountUSD,
    tokensBySymbol: tokensBySymbolSummary,
    positionsByProtocol: positionsByProtocolSummary,
  };
};
