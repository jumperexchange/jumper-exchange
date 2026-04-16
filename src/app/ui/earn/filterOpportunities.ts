import { fromPairs, map, orderBy, some, uniq, uniqBy } from 'lodash';
import type { Nullable } from 'nuqs';

import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';

import type {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
  OrderEnum,
  SortByEnum,
} from './types';
import { OrderOptions, RewardsAPYOptions, SortByOptions } from './types';
import { sortAccessors } from './utils';

const isInRange = (
  value: number | undefined,
  min?: number,
  max?: number,
): boolean => {
  if (value === undefined) {
    return min === undefined && max === undefined;
  }
  if (min !== undefined && value < min) {
    return false;
  }
  if (max !== undefined && value > max) {
    return false;
  }
  return true;
};

export function filterOpportunities(
  data: EarnOpportunityWithLatestAnalytics[],
  filter: EarnOpportunityFilterWithoutSortByAndOrder,
): EarnOpportunityWithLatestAnalytics[] {
  return data.filter((item) => {
    const {
      chains,
      protocols,
      assets,
      tags,
      minAPY,
      maxAPY,
      minTVL,
      maxTVL,
      minRewardsAPY,
      maxRewardsAPY,
    } = filter;

    // Chain filter
    if (chains?.length) {
      const itemChainIds = [
        item.lpToken.chain?.chainId,
        item.asset.chain?.chainId,
      ].filter(Boolean);
      if (!itemChainIds.some((id) => chains.includes(id!))) {
        return false;
      }
    }

    // Protocol filter
    if (protocols?.length && !protocols.includes(item.protocol.name)) {
      return false;
    }

    // Asset filter
    if (assets?.length && !assets.includes(item.asset.name)) {
      return false;
    }

    // Tag filter
    if (tags?.length && !tags.some((tag) => item.tags.includes(tag))) {
      return false;
    }

    // APY range filter
    if (!isInRange(item.latest?.apy?.total, minAPY, maxAPY)) {
      return false;
    }

    // TVL range filter
    if (
      !isInRange(
        item.latest?.tvlUsd ? parseFloat(item.latest.tvlUsd) : undefined,
        minTVL,
        maxTVL,
      )
    ) {
      return false;
    }

    // Rewards APY filter (exclusive min to filter out 0 rewards)
    const rewardsApy = item.latest.apy.jumperReward;
    if (
      minRewardsAPY !== undefined &&
      (rewardsApy === undefined || rewardsApy <= minRewardsAPY)
    ) {
      return false;
    }
    if (
      maxRewardsAPY !== undefined &&
      (rewardsApy === undefined || rewardsApy > maxRewardsAPY)
    ) {
      return false;
    }

    return true;
  });
}

export function sortOpportunities(
  data: EarnOpportunityWithLatestAnalytics[],
  sortBy: SortByEnum,
  order: OrderEnum = OrderOptions.DESC,
): EarnOpportunityWithLatestAnalytics[] {
  const accessor = sortAccessors[sortBy];
  if (!accessor) {
    return data;
  }

  return orderBy(
    data,
    [accessor],
    [order === OrderOptions.ASC ? 'asc' : 'desc'],
  );
}

export const extractFilteringParams = (
  data: EarnOpportunityWithLatestAnalytics[],
): EarnFilteringParams => {
  let allChains = [...map(data, 'lpToken.chain'), ...map(data, 'asset.chain')];
  allChains = uniqBy(allChains, 'chainId').filter(Boolean);

  let allProtocols = map(data, 'protocol');
  allProtocols = uniqBy(allProtocols, 'name').filter(Boolean);

  let allAssets = map(data, 'asset');
  allAssets = uniqBy(allAssets, 'name').filter(Boolean);

  let allTags = map(data, 'tags').flat();
  allTags = uniq(allTags).filter(Boolean);

  // Allow for 0, only check null/undefined
  const apyValues = map(data, 'latest.apy.total')
    .filter((v): v is number => v !== null && v !== undefined)
    .map((v) => Number(v));
  const uniqueApyValues = uniq(apyValues).sort((a, b) => a - b);
  const stepAPYPairs = map(uniqueApyValues, (apy, index) => [
    index / Math.max(uniqueApyValues.length - 1, 1),
    Number((apy * 100).toFixed(2)),
  ]);
  const allAPY: Record<number, number> = fromPairs(stepAPYPairs);

  // Allow for 0, only check null/undefined
  const tvlValues = map(data, 'latest.tvlUsd')
    .filter((v): v is string => v !== null && v !== undefined)
    .map((v) => parseFloat(v));
  const uniqueTvlValues = uniq(tvlValues).sort((a, b) => a - b);
  const stepTVLPairs = map(uniqueTvlValues, (tvl, index) => [
    index / Math.max(uniqueTvlValues.length - 1, 1),
    tvl,
  ]);
  const allTVL: Record<number, number> = fromPairs(stepTVLPairs);

  const withRewards = some(
    data,
    (item) => item.latest.apy.jumperReward && item.latest.apy.jumperReward > 0,
  );

  const allRewardsOptions = withRewards ? [RewardsAPYOptions.WITH_REWARDS] : [];

  return {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
    allTVL,
    allRewardsOptions,
  };
};

export const sanitizeFilter = (
  filter: EarnOpportunityFilterWithoutSortByAndOrder,
  stats: EarnFilteringParams,
): Nullable<EarnOpportunityFilterWithoutSortByAndOrder> => {
  if (
    !stats.allChains.length ||
    !stats.allProtocols.length ||
    !stats.allAssets.length ||
    !stats.allTags.length
  ) {
    return filter;
  }

  const validChainIds = new Set(stats.allChains.map((c) => c.chainId));
  const validProtocols = new Set(stats.allProtocols.map((p) => p.name));
  const validAssets = new Set(stats.allAssets.map((a) => a.name));
  const validTags = new Set(stats.allTags);
  const validAPY = new Set(
    Object.values(stats.allAPY ?? []).map((apy) => apy / 100),
  );
  const apyMin = Math.min(...validAPY, 0);
  const apyMax = Math.max(...validAPY, 0);

  const validTVL = new Set(Object.values(stats.allTVL ?? []).map((tvl) => tvl));
  const tvlMin = Math.min(...validTVL, 0);
  const tvlMax = Math.max(...validTVL, 0);

  const validRewardsOptions = new Set(stats.allRewardsOptions);

  return {
    ...filter,
    chains: filter.chains?.filter((id) => validChainIds.has(id)) ?? null,
    protocols: filter.protocols?.filter((p) => validProtocols.has(p)) ?? null,
    assets: filter.assets?.filter((a) => validAssets.has(a)) ?? null,
    tags: filter.tags?.filter((t) => validTags.has(t)) ?? null,
    minAPY:
      filter.minAPY !== undefined
        ? Math.max(Math.min(filter.minAPY, apyMax), apyMin)
        : null,
    maxAPY:
      filter.maxAPY !== undefined
        ? Math.max(Math.min(filter.maxAPY, apyMax), apyMin)
        : null,
    minTVL:
      filter.minTVL !== undefined
        ? Math.max(Math.min(filter.minTVL, tvlMax), tvlMin)
        : null,
    maxTVL:
      filter.maxTVL !== undefined
        ? Math.max(Math.min(filter.maxTVL, tvlMax), tvlMin)
        : null,
    minRewardsAPY:
      filter.minRewardsAPY !== undefined &&
      validRewardsOptions.has(RewardsAPYOptions.WITH_REWARDS)
        ? filter.minRewardsAPY
        : null,
    maxRewardsAPY:
      filter.maxRewardsAPY !== undefined &&
      validRewardsOptions.has(RewardsAPYOptions.WITH_REWARDS)
        ? filter.maxRewardsAPY
        : null,
  };
};
