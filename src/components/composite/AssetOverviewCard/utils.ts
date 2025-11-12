import { MinimalToken } from 'src/types/tokens';
import { MinimalDeFiPosition } from 'src/types/defi';
import { orderBy } from 'lodash';

export const calculateTotalPrice = <T extends { totalPriceUSD: number }>(
  items: T[],
): number => {
  return items.reduce((acc, item) => acc + item.totalPriceUSD, 0);
};

export const calculateAssetPercentage = (
  assetPrice: number,
  totalPrice: number,
): number => {
  if (totalPrice === 0) return 0;
  return (assetPrice / totalPrice) * 100;
};

export const sortAssetsByPrice = <
  T extends { totalPriceUSD: number; balance: number },
>(
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

export const groupAssets = <
  T extends { totalPriceUSD: number; balance: number },
>(
  assets: T[],
  maxDisplayCount: number = 4,
): AssetGroupingResult<T> => {
  const sorted = sortAssetsByPrice(assets);
  const totalPrice = calculateTotalPrice(assets);
  const hasOverflow = sorted.length > maxDisplayCount;

  const displayCount = hasOverflow
    ? maxDisplayCount - 1
    : Math.min(maxDisplayCount, sorted.length);

  const displayAssets = sorted.slice(0, displayCount);
  const remainderAssets = hasOverflow ? sorted.slice(displayCount) : [];

  const overflowPrice = calculateTotalPrice(remainderAssets);
  const overflowPercentage = calculateAssetPercentage(
    overflowPrice,
    totalPrice,
  );

  const overflow =
    hasOverflow && remainderAssets.length > 0
      ? {
          count: remainderAssets.length,
          price: overflowPrice,
          percentage: overflowPercentage,
        }
      : null;

  return {
    displayAssets,
    remainderAssets,
    totalPrice,
    overflow,
  };
};
