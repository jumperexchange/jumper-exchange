import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';

export type { PortfolioDefiPosition } from '../classes/PortfolioDefiPosition';
export type { PortfolioDeFiPositionsGroup } from '../classes/PortfolioDeFiPositionsGroup';

export type PortfolioPositionsQueryWithoutEvm = Omit<
  PortfolioPositionsQuery,
  'evm'
>;
