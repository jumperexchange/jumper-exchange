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

export async function getOpportunityBySlug(
  slug: string,
): Promise<GetOpportunityBySlugResult> {
  const client = makeClient();
  const response = await client.v1.earnControllerGetItemV1(slug);
  /* @ts-expect-error: see LF-15589 */
  return response.data;
}

export const getOpportunityBySlugCached = unstable_cache(
  getOpportunityBySlug,
  ['opportunity-by-slug'],
  { revalidate: 300 },
);
