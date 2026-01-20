import type { Nullable } from 'nuqs';
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs';
import type { EarnOpportunityFilterWithoutSortByAndOrder } from './types';
import { EarnFilterTab, OrderOptions, SortByOptions } from './types';

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

export const removeNullValuesFromFilter = (
  filter: Nullable<EarnOpportunityFilterWithoutSortByAndOrder>,
) => {
  return Object.fromEntries(
    Object.entries(filter).filter(([_, value]) => value !== null),
  ) as EarnOpportunityFilterWithoutSortByAndOrder;
};
