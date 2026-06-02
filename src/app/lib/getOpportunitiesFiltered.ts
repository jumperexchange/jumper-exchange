import { unstable_cache } from 'next/cache';
import type { JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetOpportunityTopResult = ReturnType<
  JumperBackend<unknown>['v1']['recommendationControllerAllV1']
>;

export type EarnOpportunityFilter = Parameters<
  JumperBackend<unknown>['v1']['recommendationControllerAllV1']
>[0];

export const getOpportunitiesFiltered = unstable_cache(
  async (filter: EarnOpportunityFilter) => {
    const client = makeClient();
    return client.v1.recommendationControllerAllV1(filter);
  },
  ['opportunities-filtered'],
  { revalidate: 60 },
);
