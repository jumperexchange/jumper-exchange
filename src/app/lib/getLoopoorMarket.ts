import type { HttpResponse, LoopoorMarket } from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetLoopoorMarketResult = HttpResponse<LoopoorMarket, unknown>;

export async function getLoopoorMarket(
  chainId: number,
  marketId: string,
): Promise<GetLoopoorMarketResult> {
  const client = makeClient();
  return client.v1.loopoorControllerGetMarketV1(chainId, marketId);
}
