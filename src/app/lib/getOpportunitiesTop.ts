import {
  EarnOpportunityWithLatestAnalytics,
  HttpResponse,
} from '@/types/jumper-backend';
import { Hex } from 'viem';
import { makeClient } from './client';

export type GetOpportunityTopResult = HttpResponse<
  EarnOpportunityWithLatestAnalytics[],
  unknown
>;

export async function getOpportunitiesTop(
  address: Hex | undefined,
): Promise<GetOpportunityTopResult> {
  const client = makeClient();
  const opportunity = await client.v1.earnControllerGetTopsV1({ address });
  return opportunity;
}
