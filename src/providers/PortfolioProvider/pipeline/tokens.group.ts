import { groupBy } from 'lodash';
import type { AugmentedToken } from '../types/tokens.types';

/**
 * Group tokens by symbol.
 * This is a pure grouping step - no transformation or sorting.
 */
export const groupTokensBySymbol = (
  tokens: AugmentedToken[],
): Record<string, AugmentedToken[]> => {
  return groupBy(tokens, (t) => t.symbol || 'Unknown');
};
