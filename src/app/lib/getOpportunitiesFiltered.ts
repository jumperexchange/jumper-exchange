import type { JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetOpportunityTopResult = ReturnType<
  JumperBackend<unknown>['v1']['recommendationControllerFilterV1']
>;

export type EarnOpportunityFilter = Parameters<
  JumperBackend<unknown>['v1']['recommendationControllerFilterV1']
>[0];

export async function getOpportunitiesFiltered(
  filter: EarnOpportunityFilter,
): Promise<GetOpportunityTopResult> {
  const client = makeClient();
  const opportunity = await client.v1.recommendationControllerFilterV1(filter);
  return opportunity;
}
