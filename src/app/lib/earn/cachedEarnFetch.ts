import { cacheLife } from 'next/cache';

import type { EarnOpportunityFilter } from '@/app/lib/getOpportunitiesFiltered';
import {
  fetchEarnFilterOpportunities,
  fetchEarnOpportunityBySlug,
  fetchEarnRelatedMarkets,
  fetchEarnTopOpportunities,
} from '@/app/lib/earn/earnQueries';
import type { Hex } from 'viem';

const EARN_PAGE_REVALIDATE_SECONDS = 300;

export async function fetchEarnFilterOpportunitiesForPage(
  filter: EarnOpportunityFilter,
) {
  'use cache';
  cacheLife({ revalidate: EARN_PAGE_REVALIDATE_SECONDS });
  return fetchEarnFilterOpportunities(filter);
}

export async function fetchEarnOpportunityBySlugForPage(slug: string) {
  'use cache';
  cacheLife({ revalidate: EARN_PAGE_REVALIDATE_SECONDS });
  return fetchEarnOpportunityBySlug(slug);
}

export async function fetchEarnRelatedMarketsForPage(slug: string) {
  'use cache';
  cacheLife({ revalidate: EARN_PAGE_REVALIDATE_SECONDS });
  return fetchEarnRelatedMarkets(slug);
}

export async function fetchEarnTopOpportunitiesForPage(address?: Hex) {
  'use cache';
  cacheLife({ revalidate: EARN_PAGE_REVALIDATE_SECONDS });
  return fetchEarnTopOpportunities(address);
}
