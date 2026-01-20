import { fromPairs, map, some, sortBy, uniq, uniqBy } from 'lodash';
import type { Nullable } from 'nuqs';
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs';
import type { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import type {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
} from './types';
import {
  EarnFilterTab,
  OrderOptions,
  RewardsAPYOptions,
  SortByOptions,
} from './types';

export const searchParamsParsers = {
  sortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.APY,
  ),
  tab: parseAsStringEnum(Object.values(EarnFilterTab)).withDefault(
    EarnFilterTab.FOR_YOU,
  ),
  /** @deprecated Use `tab` query param instead. Kept for backward compatibility with existing bookmarks. */
  forYou: parseAsBoolean,
  /** @deprecated Use `tab` query param instead. Kept for backward compatibility with existing bookmarks. */
  withPositions: parseAsBoolean,
  order: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.DESC,
  ),
  chains: parseAsArrayOf(parseAsInteger),
  protocols: parseAsArrayOf(parseAsString),
  assets: parseAsArrayOf(parseAsString),
  tags: parseAsArrayOf(parseAsString),
  minAPY: parseAsFloat,
  maxAPY: parseAsFloat,
  minTVL: parseAsFloat,
  maxTVL: parseAsFloat,
  minRewardsAPY: parseAsFloat,
  maxRewardsAPY: parseAsFloat,
};

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

  let formattedAPY = map(data, 'latest.apy.total').filter(Boolean);
  formattedAPY = uniq(formattedAPY).filter(Boolean);
  formattedAPY = sortBy(formattedAPY);
  const stepAPYPairs = map(formattedAPY, (apy, index) => [
    index / (formattedAPY.length - 1),
    (apy * 100).toFixed(2),
  ]);
  const allAPY = fromPairs(stepAPYPairs);

  let formattedTVL = map(data, 'latest.tvlUsd').filter(Boolean);
  formattedTVL = uniq(formattedTVL).filter(Boolean);
  formattedTVL = sortBy(formattedTVL);
  const stepTVLPairs = map(formattedTVL, (tvl, index) => [
    index / (formattedTVL.length - 1),
    tvl,
  ]);
  const allTVL = fromPairs(stepTVLPairs);

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

export const removeNullValuesFromFilter = (
  filter: Nullable<EarnOpportunityFilterWithoutSortByAndOrder>,
) => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== null),
  ) as EarnOpportunityFilterWithoutSortByAndOrder;
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

export const enrichDataWithFlag = <
  T extends { slug: string },
  K extends { [P in keyof T]: T[P] extends boolean ? P : never }[keyof T] &
    string,
>(
  data: T[] | undefined,
  flagName: K,
  matchingSlugs: Set<string>,
): T[] => {
  return (data ?? []).map((item) => ({
    ...item,
    [flagName]: matchingSlugs.has(item.slug),
  })) as T[];
};
