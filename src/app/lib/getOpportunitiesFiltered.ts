import type { JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

export type EarnOpportunityFilter = Parameters<
  JumperBackend<unknown>['v1']['recommendationControllerAllV1']
>[0];

export async function getOpportunitiesFiltered(filter: EarnOpportunityFilter) {
  const client = makeClient();
  const opportunity = await client.v1.recommendationControllerAllV1(filter);
  return opportunity;
}
