import type { JumperBackend, PnlResponseDto } from '@/types/jumper-backend';
import { makeClient } from './client';

export type PnlQuery = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetUserPnlV1']
>[0];

export async function getPortfolioPnl(
  query: PnlQuery,
): Promise<PnlResponseDto> {
  const client = makeClient();
  const result = await client.v1.portfolioControllerGetUserPnlV1(query);
  return result.data;
}
