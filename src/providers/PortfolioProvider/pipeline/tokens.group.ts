import { groupBy } from 'lodash';
import type { EnrichedToken, TokensBySymbol } from '../types/tokens.types';

/**
 * Group tokens by symbol.
 * Multiple tokens with the same symbol (e.g., USDC on different chains)
 * are grouped together for aggregation.
 */
export const groupTokensBySymbol = (
  tokens: EnrichedToken[],
): TokensBySymbol => {
  return groupBy(tokens, (t) => t.symbol || 'Unknown');
};
