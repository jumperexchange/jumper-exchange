import type {
  HttpResponse,
  LoopoorMarketHistory,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetLoopoorMarketHistoryResult = HttpResponse<
  LoopoorMarketHistory,
  unknown
>;

export async function getLoopoorMarketHistory(
  chainId: number,
  marketId: string,
): Promise<GetLoopoorMarketHistoryResult> {
  const client = makeClient();
  return client.v1.loopoorControllerGetMarketHistoryV1(chainId, marketId);
}
