import { compact, groupBy as groupByLodash, orderBy, values } from 'lodash';
import { PortfolioDeFiPositionsGroup } from '../classes/PortfolioDeFiPositionsGroup';
import type { PortfolioDefiPosition } from '../types/positions.types';

export type PositionGroupingFn = (position: PortfolioDefiPosition) => string;

export type PositionGroupingKey = 'byProtocol' | 'byProtocolAndChain';

export const groupByProtocol: PositionGroupingFn = (p) => p.protocol.name;

export const groupByProtocolAndChain: PositionGroupingFn = (p) =>
  `${p.protocol.name}-${p.chain.chainKey}`;

export const positionGroupingFns: Record<
  PositionGroupingKey,
  PositionGroupingFn
> = {
  byProtocol: groupByProtocol,
  byProtocolAndChain: groupByProtocolAndChain,
};

export const toPositionsGroup = (
  positions: PortfolioDefiPosition[],
): PortfolioDeFiPositionsGroup | null => {
  if (positions.length === 0) {
    return null;
  }
  return new PortfolioDeFiPositionsGroup(positions, 0);
};

export const groupPositions = (
  positions: PortfolioDefiPosition[],
  groupBy: PositionGroupingKey,
): PortfolioDeFiPositionsGroup[] => {
  const groupingFn = positionGroupingFns[groupBy];
  const grouped = groupByLodash(positions, groupingFn);
  const groups = values(grouped).map(toPositionsGroup);
  return orderBy(compact(groups), (g) => g.amountUSD, 'desc');
};
