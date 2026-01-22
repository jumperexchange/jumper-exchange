import type { Protocol } from 'src/types/jumper-backend';
import type { DefiPosition } from '@/utils/positions/type-guards';
import { orderBy } from 'lodash';
import type { ProtocolGroupData } from './AssetOverviewCard.types';

export const calculateTotalPrice = <T extends { totalPriceUSD: number }>(
  items: T[],
): number => {
  return items.reduce((acc, item) => acc + item.totalPriceUSD, 0);
};

export const mapPositionGroupsToProtocolData = (
  groups: DefiPosition[][],
): ProtocolGroupData[] => {
  return groups
    .filter((group) => group.length > 0)
    .map((group) => ({
      protocol: group[0].protocol,
      totalPriceUSD: group.reduce((sum, pos) => sum + pos.netUsd, 0),
    }));
};

export const calculateAssetPercentage = (
  assetPrice: number,
  totalPrice: number,
): number => {
  if (totalPrice === 0) {
    return 0;
  }
  return (assetPrice / totalPrice) * 100;
};

export const sortAssetsByPrice = <T extends { totalPriceUSD: number }>(
  assets: T[],
): T[] => orderBy(assets, 'totalPriceUSD', 'desc');

export interface OverflowInfo {
  count: number;
  price: number;
  percentage: number;
}

export interface AssetGroupingResult<T extends { totalPriceUSD: number }> {
  displayAssets: T[];
  remainderAssets: T[];
  totalPrice: number;
  overflow: OverflowInfo | null;
}

export const groupAssets = <T extends { totalPriceUSD: number }>(
  assets: T[],
  maxDisplayCount: number = 4,
): AssetGroupingResult<T> => {
  const totalPrice = calculateTotalPrice(assets);
  const hasOverflow = assets.length > maxDisplayCount;

  const displayCount = hasOverflow
    ? maxDisplayCount - 1
    : Math.min(maxDisplayCount, assets.length);

  const displayAssets = assets.slice(0, displayCount);
  const remainderAssets = hasOverflow ? assets.slice(displayCount) : [];

  const overflowPrice = calculateTotalPrice(remainderAssets);
  const overflowPercentage = calculateAssetPercentage(
    overflowPrice,
    totalPrice,
  );

  let overflow = null;
  if (hasOverflow && remainderAssets.length > 0) {
    overflow = {
      count: remainderAssets.length,
      price: overflowPrice,
      percentage: overflowPercentage,
    };
  }

  return {
    displayAssets,
    remainderAssets,
    totalPrice,
    overflow,
  };
};
