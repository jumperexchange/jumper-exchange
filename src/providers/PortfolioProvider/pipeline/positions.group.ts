import { groupBy } from 'lodash';
import type {
  EnrichedPosition,
  PositionsByProtocol,
  PositionsByProtocolChain,
} from '../types/positions.types';

/**
 * Group positions by protocol name.
 */
export const groupPositionsByProtocol = (
  positions: EnrichedPosition[],
): PositionsByProtocol => {
  return groupBy(positions, (p) => p.protocol.name);
};

/**
 * Group positions by protocol and chain.
 * Key format: "${protocol.name}-${chain.chainKey}"
 */
export const groupPositionsByProtocolAndChain = (
  positions: EnrichedPosition[],
): PositionsByProtocolChain => {
  return groupBy(positions, (p) => `${p.protocol.name}-${p.chain.chainKey}`);
};
