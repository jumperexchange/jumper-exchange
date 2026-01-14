import { getPositionsForAddress } from '@/app/lib/getPositionsForAddress';
import type { PortfolioPositionsQuery } from '@/app/lib/getPositionsForAddress';
import type {
  DefiPosition,
  MetadataWithUpdatedAt,
} from '@/types/jumper-backend';

export interface FetchPositionsParams {
  address: string;
  filter?: Omit<PortfolioPositionsQuery, 'evm'>;
}

export interface FetchPositionsResult {
  positions: DefiPosition[];
  meta: MetadataWithUpdatedAt;
  address: string;
}

/** Fetch positions for a single wallet address */
export const fetchPositionsForAddress = async ({
  address,
  filter,
}: FetchPositionsParams): Promise<FetchPositionsResult> => {
  const result = await getPositionsForAddress({
    evm: address,
    ...filter,
  });

  return {
    positions: result.data.data,
    meta: result.data.meta,
    address,
  };
};

/** Fetch positions for multiple addresses */
export const fetchPositionsForAddresses = async (
  params: FetchPositionsParams[],
): Promise<FetchPositionsResult[]> => {
  return Promise.all(params.map(fetchPositionsForAddress));
};
