import type { HttpResponse, LoopoorMarket } from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetLoopoorMarketsResult = HttpResponse<LoopoorMarket[], unknown>;

export async function getLoopoorMarkets(
  chainId: number,
): Promise<GetLoopoorMarketsResult> {
  const client = makeClient();
  return client.v1.loopoorControllerListMarketsV1({ chainId: String(chainId) });
}
