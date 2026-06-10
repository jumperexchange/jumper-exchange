import type { JumperBackend } from '@/types/jumper-backend';
import { makeClient } from './client';

export type BalanceHistoryQuery = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetUserBalanceHistoryV1']
>[0];

export async function getPortfolioBalanceHistory(query: BalanceHistoryQuery) {
  const client = makeClient();
  return client.v1.portfolioControllerGetUserBalanceHistoryV1(query);
}
