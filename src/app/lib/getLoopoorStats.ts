import type {
  HttpResponse,
  LoopoorStatsResponse,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetLoopoorStatsResult = HttpResponse<LoopoorStatsResponse, unknown>;

export async function getLoopoorStats(
  chainId: number,
  marketId: string,
  query: {
    leverageFactor: number;
    amount?: string;
    slippage?: number;
    safetyBuffer?: number;
  },
): Promise<GetLoopoorStatsResult> {
  const client = makeClient();
  return client.v1.loopoorControllerGetStatsV1(chainId, marketId, query);
}
