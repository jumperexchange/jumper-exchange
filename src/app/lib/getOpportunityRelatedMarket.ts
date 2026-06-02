import { unstable_cache } from 'next/cache';
import type {
  EarnOpportunityWithLatestAnalytics,
  HttpResponse,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetOpportunityRelatedMarketResult = HttpResponse<
  EarnOpportunityWithLatestAnalytics[],
  unknown
>;

export async function getOpportunityRelatedMarket(
  slug: string,
): Promise<GetOpportunityRelatedMarketResult> {
  const client = makeClient();
  const response = await client.v1.earnControllerGetRelatedItemsV1(slug);
  /* @ts-expect-error: see LF-15589 */
  return response.data;
}

export const getOpportunityRelatedMarketCached = unstable_cache(
  getOpportunityRelatedMarket,
  ['opportunity-related-market'],
  { revalidate: 300 },
);
