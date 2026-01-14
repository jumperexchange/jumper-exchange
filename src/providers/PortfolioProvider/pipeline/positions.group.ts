import { groupBy } from 'lodash';
import type { AugmentedPosition } from './positions.augment';

/**
 * Group positions by protocol name.
 * This is a pure grouping step - no transformation or sorting.
 */
export const groupPositionsByProtocol = (
  positions: AugmentedPosition[],
): Record<string, AugmentedPosition[]> => {
  return groupBy(positions, (p) => p.protocol.name);
};

/**
 * Group positions by protocol and chain.
 * This is a pure grouping step - no transformation or sorting.
 */
export const groupPositionsByProtocolAndChain = (
  positions: AugmentedPosition[],
): Record<string, AugmentedPosition[]> => {
  return groupBy(positions, (p) => `${p.protocol.name}-${p.chain.chainKey}`);
};
