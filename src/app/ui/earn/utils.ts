import { map, uniqBy, uniq, sortBy, fromPairs } from 'lodash';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import { EarnFilteringParams, OrderOptions, SortByOptions } from './types';
import { toFixedFractionDigits } from 'src/utils/formatNumbers';
import {
  parseAsStringEnum,
  parseAsBoolean,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsFloat,
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
