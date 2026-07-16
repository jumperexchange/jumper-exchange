import type { Hex } from 'viem';
import { makeClient } from './client';

export async function getOpportunitiesTop(address: Hex | undefined) {
  const client = makeClient();
  const opportunity = await client.v1.recommendationControllerGetTopsV1({
    address,
  });
  return opportunity;
}
