import type {
  BalancesFilteringParams,
  PositionsFilteringParams,
} from './types';

export const EMPTY_BALANCES_FILTERING_PARAMS: BalancesFilteringParams = {
  allWallets: [],
  allChains: [],
  allAssets: [],
  allValueRange: { min: 0, max: 0 },
};

export const EMPTY_POSITIONS_FILTERING_PARAMS: PositionsFilteringParams = {
  allChains: [],
  allProtocols: [],
  allTypes: [],
  allAssets: [],
  allValueRange: { min: 0, max: 0 },
};

export const DEFAULT_POSITIONS_MIN_VALUE = 1;
