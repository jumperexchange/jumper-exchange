import type { EarnOpportunities, JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

export type EarnOpportunityFilter = Parameters<
  JumperBackend<unknown>['v1']['recommendationControllerAllV1']
>[0];

export async function getOpportunitiesFiltered(filter: EarnOpportunityFilter) {
  const client = makeClient();
  const response = await client.v1.recommendationControllerAllV1(filter);
  return response.data;
}
