import { map, uniqBy, uniq } from 'lodash';
import { EarnCardVariant } from 'src/components/Cards/EarnCard/EarnCard.types';
import { EarnOpportunityWithLatestAnalytics } from 'src/types/jumper-backend';
import {
  EarnFilteringParams,
  EarnsPageSearchParams,
  FilterKey,
  SortByOptions,
} from './types';
import { EarnOpportunityFilter } from 'src/app/lib/getOpportunitiesFiltered';

const parseString = (value: string): string | null => {
  return value.trim() || null;
};

const parseBoolean = (value: string): boolean | null => {
  return value === 'true' ? true : value === 'false' ? false : null;
};

const parseNumber = (value: string): number | null => {
  const num = Number(value);
  return isNaN(num) ? null : num;
};

const parseNumberArray = (value: string): number[] | null => {
  const numbers = value
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => !isNaN(n));

  return numbers.length > 0 ? numbers : null;
};

const parseStringArray = (value: string): string[] | null => {
  const strings = value.split(',').map(parseString).filter(Boolean) as string[];

  return strings.length > 0 ? strings : null;
};

const PARAM_CONFIG = {
  forYou: { target: 'forYou', parser: parseBoolean },
  featured: { target: 'featured', parser: parseBoolean },
  chains: { target: 'chains', parser: parseNumberArray },
  protocols: { target: 'protocols', parser: parseStringArray },
  assets: { target: 'assets', parser: parseStringArray },
  tags: { target: 'tags', parser: parseStringArray },
  apy: { target: 'minAPY', parser: parseNumber },
  tvl: { target: 'maxAPY', parser: parseNumber },
} as const;

export const parseFiltersFromUrl = (
  searchParams?: EarnsPageSearchParams,
): EarnOpportunityFilter => {
  if (!searchParams) return;

  const result: EarnOpportunityFilter = {};

  // Process each configured parameter
  for (const [key, config] of Object.entries(PARAM_CONFIG)) {
    const targetKey = config.target as FilterKey;
    const value = searchParams[targetKey];

    if (!value) continue;

    const parsedValue = config.parser(value);

    if (parsedValue !== null) {
      result[config.target as FilterKey] =
        parsedValue as (typeof result)[FilterKey];
    }
  }

  return result;
};

export const serializeFilterValue = (value: any): string | null => {
  if (value === undefined || value === null) return null;

  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(',') : null;
  }

  if (typeof value === 'boolean') {
    return value.toString();
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'string') {
    return value.trim() || null;
  }

  return null;
};

export const extractFilteringParams = (
  data: EarnOpportunityWithLatestAnalytics[],
): EarnFilteringParams => {
  let allChains = [...map(data, 'lpToken.chain'), ...map(data, 'asset.chain')];
  allChains = uniqBy(allChains, 'chainId').filter(Boolean);

  let allProtocols = map(data, 'protocol');
  allProtocols = uniqBy(allProtocols, 'name').filter(Boolean);

  let allAssets = map(data, 'asset');
  allAssets = uniqBy(allAssets, 'address').filter(Boolean);

  let allTags = map(data, 'tags').flat();
  allTags = uniq(allTags).filter(Boolean);

  let allAPY = {
    0.1: 1,
    0.2: 2,
    0.3: 3,
  };

  return {
    allChains,
    allProtocols,
    allAssets,
    allTags,
    allAPY,
  };
};
