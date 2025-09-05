import { EarnOpportunity, HttpResponse } from '@/types/jumper-backend';
import { Hex } from 'viem';
import { makeClient } from './client';

export type GetOpportunityTopResult = HttpResponse<EarnOpportunity[], unknown>;

export async function getOpportunitiesTop(
  address: Hex,
): Promise<GetOpportunityTopResult> {
  const client = makeClient();
  const opportunity = await client.v1.earnControllerGetTopsV1({ address });
  return opportunity;
}
