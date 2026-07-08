import { getPositionsForAddresses } from '@/app/lib/getPositionsForAddress';
import type { JumperBackend } from '@/types/jumper-backend';

export type FetchPositionsParams = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetPositionsForAddressV1']
>[0];
export const fetchPositionsForAddresses = async (
  params: FetchPositionsParams,
) => {
  const result = await getPositionsForAddresses(params);
  return result;
};
