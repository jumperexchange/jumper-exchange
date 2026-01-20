import { fromPairs, map, some, uniq, uniqBy } from 'lodash';
import type { Nullable } from 'nuqs';

import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';

import type {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
  OrderEnum,
  SortByEnum,
} from './types';
import { OrderOptions, RewardsAPYOptions, SortByOptions } from './types';

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
    const apy = item.latest?.apy?.total;
    if (minAPY !== undefined && (apy === undefined || apy < minAPY)) {
      return false;
    }
    if (maxAPY !== undefined && (apy === undefined || apy > maxAPY)) {
      return false;
    }

    // TVL range filter
    const tvl = item.latest?.tvlUsd
      ? parseFloat(item.latest.tvlUsd)
      : undefined;
    if (minTVL !== undefined && (tvl === undefined || tvl < minTVL)) {
      return false;
    }
    if (maxTVL !== undefined && (tvl === undefined || tvl > maxTVL)) {
      return false;
    }

    // Rewards APY filter
    const rewardsApy = item.rewardsApy;
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
  const getValue = (item: EarnOpportunityWithLatestAnalytics): number => {
    switch (sortBy) {
      case SortByOptions.APY:
        return item.latest?.apy?.total ?? 0;
      case SortByOptions.TVL:
        return parseFloat(item.latest?.tvlUsd ?? '0');
      default:
        return 0;
    }
  };

  return [...data].sort((a, b) => {
    const diff = getValue(a) - getValue(b);
    return order === OrderOptions.ASC ? diff : -diff;
  });
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
    (item) => item.rewardsApy && item.rewardsApy > 0,
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
