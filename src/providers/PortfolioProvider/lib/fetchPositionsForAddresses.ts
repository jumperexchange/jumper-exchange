import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import type {
  HttpResponse,
  JumperBackend,
  WalletPositions,
} from '@/types/jumper-backend';

export type FetchPositionsParams = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetPositionsForAddressV1']
>[0];

export type FetchPositionsResult = HttpResponse<WalletPositions, unknown>;

/** Fetch positions for a single wallet address */
export const fetchPositionsForAddress = async (
  params: FetchPositionsParams,
): Promise<FetchPositionsResult> => {
  const result = await getPositionsForAddress(params);
  return result;
};

/** Fetch positions for multiple addresses */
export const fetchPositionsForAddresses = async (
  params: FetchPositionsParams[],
): Promise<FetchPositionsResult[]> => {
  return Promise.all(params.map(fetchPositionsForAddress));
};
