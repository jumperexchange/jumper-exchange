import {
  EarnOpportunity,
  HttpResponse,
  JumperBackend,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetOpportunityTopResult = HttpResponse<EarnOpportunity[], unknown>;

export type EarnOpportunityFilter = Parameters<
  JumperBackend<unknown>['v1']['earnControllerFilterV1']
>[0];

export async function getOpportunitiesFiltered(
  filter: EarnOpportunityFilter,
): Promise<GetOpportunityTopResult> {
  const client = makeClient();
  const opportunity = await client.v1.earnControllerFilterV1(filter);
  return opportunity;
}
