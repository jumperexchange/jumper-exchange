import { unstable_cache } from 'next/cache';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { makeClient } from './client';

export async function getOpportunityRelatedMarket(
  slug: string,
): Promise<EarnOpportunityWithLatestAnalytics[]> {
  const client = makeClient();
  const response = await client.v1.earnControllerGetRelatedItemsV1(slug);
  return (response.data ?? []).filter(Boolean).slice(0, 3);
}

export const getOpportunityRelatedMarketCached = unstable_cache(
  getOpportunityRelatedMarket,
  ['opportunity-related-market'],
  { revalidate: 300 },
);
