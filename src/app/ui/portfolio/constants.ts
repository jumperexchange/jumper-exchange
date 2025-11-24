import type {
  PortfolioDeFiPositionsFilteringParams,
  PortfolioTokensFilteringParams,
} from './types';

export const EMPTY_TOKENS_FILTERING_PARAMS: PortfolioTokensFilteringParams = {
  allWallets: [],
  allChains: [],
  allAssets: [],
  allValueRange: { min: 0, max: 0 },
};

export const EMPTY_DEFI_POSITIONS_FILTERING_PARAMS: PortfolioDeFiPositionsFilteringParams =
  {
    allChains: [],
    allProtocols: [],
    allTypes: [],
    allAssets: [],
    allAPYRange: { min: 0, max: 0 },
    allValueRange: { min: 0, max: 0 },
  };
