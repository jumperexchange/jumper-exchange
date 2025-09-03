import { EarnOpportunity, HttpResponse } from '@/types/jumper-backend';
import { EVMAddress } from 'src/types/internal';
import { makeClient } from './client';

export type GetOpportunityTopResult = HttpResponse<EarnOpportunity[], unknown>;

export async function getOpportunitiesTop(
  address: EVMAddress,
): Promise<GetOpportunityTopResult> {
  const client = makeClient();
  const opportunity = await client.v1.earnControllerGetTopsV1({ address });
  return opportunity;
}
