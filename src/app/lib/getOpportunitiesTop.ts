import type { EarnOpportunities, HttpResponse } from '@/types/jumper-backend';
import type { Hex } from 'viem';
import { makeClient } from './client';

export type GetOpportunityTopResult = HttpResponse<EarnOpportunities, unknown>;

export async function getOpportunitiesTop(
  address: Hex | undefined,
): Promise<GetOpportunityTopResult> {
  const client = makeClient();
  const opportunity = await client.v1.recommendationControllerGetTopsV1({
    address,
  });
  return opportunity;
}
