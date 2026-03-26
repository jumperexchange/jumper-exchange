import { getPositionsForAddresses } from '@/app/lib/getPositionsForAddress';
import type {
  HttpResponse,
  JumperBackend,
  WalletPositions,
} from '@/types/jumper-backend';

export type FetchPositionsParams = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetPositionsForAddressV1']
>[0];

export type FetchPositionsResult = HttpResponse<WalletPositions, unknown>;

export const fetchPositionsForAddresses = async (
  params: FetchPositionsParams,
): Promise<FetchPositionsResult> => {
  const result = await getPositionsForAddresses(params);
  return result;
};
