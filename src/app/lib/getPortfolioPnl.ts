import type { JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

export type PnlQuery = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetUserPnlV1']
>[0];

export async function getPortfolioPnl(query: PnlQuery) {
  const client = makeClient();
  return await client.v1.portfolioControllerGetUserPnlV1(query);
}
