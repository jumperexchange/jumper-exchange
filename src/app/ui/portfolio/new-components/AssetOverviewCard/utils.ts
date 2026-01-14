import type { DefiPosition, Protocol } from '@/types/jumper-backend';
import { orderBy, sumBy } from 'lodash';
import type { ProtocolGroupData } from './AssetOverviewCard.types';

export const calculateTotalValueUSD = <T extends { totalValueUSD: number }>(
  items: T[],
): number => {
  return sumBy(items, 'totalValueUSD');
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

export const calculateAssetPercentage = <
  T extends { percentageOfTotalValueUSD: number },
>(
  items: T[],
): number => {
  return sumBy(items, 'percentageOfTotalValueUSD');
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
