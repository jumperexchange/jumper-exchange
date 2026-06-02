import { unstable_cache } from 'next/cache';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { makeClient } from './client';

export async function getOpportunityBySlug(
  slug: string,
): Promise<EarnOpportunityWithLatestAnalytics | undefined> {
  const client = makeClient();
  const response = await client.v1.earnControllerGetItemV1(slug);
  return response.data;
}

export const getOpportunityBySlugCached = unstable_cache(
  getOpportunityBySlug,
  ['opportunity-by-slug'],
  { revalidate: 300 },
);
