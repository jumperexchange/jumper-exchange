import { unstable_cache } from 'next/cache';

import type { EarnOpportunityFilter } from '@/app/lib/getOpportunitiesFiltered';
import {
  fetchEarnFilterOpportunities,
  fetchEarnOpportunityBySlug,
  fetchEarnRelatedMarkets,
  fetchEarnTopOpportunities,
} from '@/app/lib/earn/earnQueries';
import type { Hex } from 'viem';

const EARN_PAGE_REVALIDATE_SECONDS = 300;

export const fetchEarnFilterOpportunitiesForPage = (
  filter: EarnOpportunityFilter,
) =>
  unstable_cache(
    () => fetchEarnFilterOpportunities(filter),
    ['earn-page-filter-opportunities', JSON.stringify(filter)],
    { revalidate: EARN_PAGE_REVALIDATE_SECONDS },
  )();

export const fetchEarnOpportunityBySlugForPage = (slug: string) =>
  unstable_cache(
    () => fetchEarnOpportunityBySlug(slug),
    ['earn-page-opportunity-by-slug', slug],
    { revalidate: EARN_PAGE_REVALIDATE_SECONDS },
  )();

export const fetchEarnRelatedMarketsForPage = (slug: string) =>
  unstable_cache(
    () => fetchEarnRelatedMarkets(slug),
    ['earn-page-related-markets', slug],
    { revalidate: EARN_PAGE_REVALIDATE_SECONDS },
  )();

export const fetchEarnTopOpportunitiesForPage = (address?: Hex) =>
  unstable_cache(
    () => fetchEarnTopOpportunities(address),
    ['earn-page-top-opportunities', address ?? 'anonymous'],
    { revalidate: EARN_PAGE_REVALIDATE_SECONDS },
  )();
