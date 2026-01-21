import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';

export type { PortfolioDefiPosition } from './PortfolioDefiPosition';
export type { PortfolioDeFiPositionsGroup } from './PortfolioDeFiPositionsGroup';

export type PortfolioPositionsQueryWithoutEvm = Omit<
  PortfolioPositionsQuery,
  'evm'
>;
