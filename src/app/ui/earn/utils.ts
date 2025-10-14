import { map, uniqBy, uniq, sortBy, fromPairs } from 'lodash';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import {
  EarnFilteringParams,
  EarnOpportunityFilterWithoutSortByAndOrder,
  OrderOptions,
  SortByOptions,
} from './types';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import {
  parseAsStringEnum,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsFloat,
  Nullable,
} from 'nuqs';

export const searchParamsParsers = {
  sortBy: parseAsStringEnum(Object.values(SortByOptions)).withDefault(
    SortByOptions.APY,
  ),
  forYou: parseAsBoolean.withDefault(true),
  order: parseAsStringEnum(Object.values(OrderOptions)).withDefault(
    OrderOptions.ASC,
  ),
  chains: parseAsArrayOf(parseAsInteger),
  protocols: parseAsArrayOf(parseAsString),
  assets: parseAsArrayOf(parseAsString),
  tags: parseAsArrayOf(parseAsString),
  minAPY: parseAsFloat,
  maxAPY: parseAsFloat,
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
    toFixedFractionDigits(apy * 100, 0, 2),
  ]);
  const allAPY = fromPairs(stepAPYPairs);

  return {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
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
  };
};
