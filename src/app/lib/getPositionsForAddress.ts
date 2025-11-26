import type {
  HttpResponse,
  JumperBackend,
  WalletPositions,
} from '@/types/jumper-backend';
import { makeClient } from './client';

export type GetPositionsForAddressResult = HttpResponse<
  WalletPositions,
  unknown
>;

export type PortfolioPositionsQuery = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetPositionsForAddressV1']
>[0];

export async function getPositionsForAddress(
  query: PortfolioPositionsQuery,
): Promise<GetPositionsForAddressResult> {
  const client = makeClient();
  const positions =
    await client.v1.portfolioControllerGetPositionsForAddressV1(query);
  return positions;
}
