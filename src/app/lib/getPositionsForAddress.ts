import type {
  HttpResponse,
  JumperBackend,
  WalletPositions,
} from '@/types/jumper-backend';
import { ChainType } from '@lifi/sdk';
import { makeClient } from './client';

export type GetPositionsForAddressResult = HttpResponse<
  WalletPositions,
  unknown
>;

export type PortfolioPositionsQuery = Parameters<
  JumperBackend<unknown>['v1']['portfolioControllerGetPositionsForAddressV1']
>[0];

export type AddressQueryParams = Pick<
  NonNullable<PortfolioPositionsQuery>,
  'evm' | 'svm' | 'mvm' | 'utxo' | 'tvm'
>;

export type PositionsFilter = Omit<
  NonNullable<PortfolioPositionsQuery>,
  keyof AddressQueryParams
>;

export const CHAIN_TYPE_TO_QUERY_PARAM: Partial<
  Record<ChainType, keyof AddressQueryParams>
> = {
  [ChainType.EVM]: 'evm',
  [ChainType.SVM]: 'svm',
  [ChainType.MVM]: 'mvm',
  [ChainType.UTXO]: 'utxo',
  [ChainType.TVM]: 'tvm',
};

export async function getPositionsForAddresses(
  query: PortfolioPositionsQuery,
): Promise<GetPositionsForAddressResult> {
  const client = makeClient();
  const positions =
    await client.v1.portfolioControllerGetPositionsForAddressV1(query);
  return positions;
}
