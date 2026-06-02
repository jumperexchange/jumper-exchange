import { unstable_cache } from 'next/cache';
import type {
  EarnOpportunityWithLatestAnalytics,
  HttpResponse,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetOpportunityBySlugResult = HttpResponse<
  EarnOpportunityWithLatestAnalytics,
  unknown
>;

export const getOpportunityBySlug = unstable_cache(
  async (slug: string): Promise<GetOpportunityBySlugResult> => {
    try {
      const client = makeClient();
      const opportunity = await client.v1.earnControllerGetItemV1(slug);
      /* @ts-expect-error: see LF-15589 - we are transforming data in the backend */
      return opportunity.data;
    } catch (error) {
      console.error('getOpportunityBySlug failed for slug', slug, error);
      throw error;
    }
  },
  ['opportunity-by-slug'],
  { revalidate: 300 },
);
