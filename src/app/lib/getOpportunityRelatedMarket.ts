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

export const getOpportunityRelatedMarket = unstable_cache(
  async (slug: string): Promise<GetOpportunityRelatedMarketResult> => {
    try {
      const client = makeClient();
      const data = await client.v1.earnControllerGetRelatedItemsV1(slug);
      // @ts-expect-error: see LF-15589 - we are transforming data in the backend
      return data.data;
    } catch (error) {
      console.error('getOpportunityRelatedMarket failed for slug', slug, error);
      throw error;
    }
  },
  ['opportunity-related-market'],
  { revalidate: 300 },
);
