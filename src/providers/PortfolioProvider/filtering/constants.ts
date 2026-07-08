import type { HoldingsFilteringParams } from './types';

export const EMPTY_HOLDINGS_FILTERING_PARAMS: HoldingsFilteringParams = {
  allWallets: [],
  allChains: [],
  allAssets: [],
  allValueRange: { min: 0, max: 0 },
};

export const DEFAULT_MIN_VALUE = 1;
