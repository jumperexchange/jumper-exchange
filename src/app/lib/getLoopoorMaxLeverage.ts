import type {
  HttpResponse,
  LoopoorMaxLeverageResponse,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetLoopoorMaxLeverageResult = HttpResponse<
  LoopoorMaxLeverageResponse,
  unknown
>;

export async function getLoopoorMaxLeverage(
  chainId: number,
  marketId: string,
  query?: { slippage?: number; safetyBuffer?: number },
): Promise<GetLoopoorMaxLeverageResult> {
  const client = makeClient();
  return client.v1.loopoorControllerGetMaxLeverageV1(chainId, marketId, query);
}
