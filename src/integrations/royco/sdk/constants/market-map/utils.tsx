import type { RoycoMarketMapDataType } from './market-map';
import { MarketMap } from './market-map';

export const isVerifiedMarket = (
  marketId: string | undefined | null,
): boolean => {
  if (!marketId) {
    return false;
  }

  return !!MarketMap[marketId];
};

export const getVerifiedMarket = (
  marketId: string | undefined | null,
): RoycoMarketMapDataType | undefined => {
  if (!marketId) {
    return undefined;
  }

  return MarketMap[marketId];
};
