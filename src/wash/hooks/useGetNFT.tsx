import { useCallback, useEffect, useState } from 'react';
import { useUmi } from '../contexts/useUmi';
import { colorDict, WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useQuery } from '@tanstack/react-query';

import type { TColor } from '../utils/theme';
import type { TNFTItem, TProgress } from '../types/types';

type TNFTResponse = {
  imageUri: string;
  name: string;
  progress: string;
  publicKey: string;
  color: TColor;
  isRare?: boolean;
  isRevealed?: boolean;
};
export type TGetNFT = {
  nft?: TNFTItem;
  isLoading: boolean;
  hasNFT: boolean;
  error: Error | null;
  refetch?: VoidFunction;
};

export function useGetNFT(): TGetNFT {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { umi } = useUmi();
  const [useUpdatedQuery, set_useUpdatedQuery] = useState(false);

  /**********************************************************************************************
   * fetchCachedNFT Function
   *
   * This function fetches the cached NFT data from the server. As the data need to be
   * revalidated by the backend (updating the progress based on the trade outside of the UI), we
   * first use this function to fetch the (probably) cached NFT data.
   * This endpoint does serve the cached data directly without delay.
   *
   * @returns The NFT data from the server.
   *********************************************************************************************/
  const fetchCachedNFT = useCallback(async (): Promise<TNFTResponse> => {
    const response = await fetch(
      `${WASH_ENDPOINT_ROOT_URI}/user/${umi?.identity.publicKey}/nft`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${base58.serialize(account.address ?? '')}`,
        },
      },
    );
    const result = await response.json();
    return result.data;
  }, [umi, account.address]);

  const cachedQuery = useQuery({
    queryKey: ['cachedNFTItem'],
    queryFn: fetchCachedNFT,
    enabled: Boolean(umi && account.isConnected && account.address),
  });

  /**********************************************************************************************
   * fetchUpdatedNFT Function
   *
   * This function fetches the updated NFT data from the server.
   * It uses a different endpoint that triggers a revalidation of the NFT data on the backend.
   * This ensures that the latest progress and state of the NFT are retrieved, reflecting any
   * recent trades or changes that may have occurred outside of the UI.
   *
   * Note: This function may have a slightly longer response time compared to fetchCachedNFT
   * due to the backend revalidation process.
   *
   * @returns The updated NFT data from the server.
   *********************************************************************************************/
  const fetchUpdatedNFT = useCallback(async (): Promise<TNFTResponse> => {
    const response = await fetch(
      `${WASH_ENDPOINT_ROOT_URI}/major/user/${umi?.identity.publicKey}/nft`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${base58.serialize(account.address ?? '')}`,
        },
      },
    );
    const result = await response.json();
    return result.data;
  }, [umi, account.address]);

  const updatedQuery = useQuery({
    queryKey: ['updatedNFTItem'],
    queryFn: fetchUpdatedNFT,
    enabled: Boolean(umi && account.isConnected && account.address),
  });

  /************************************************************************************************
   * NFT Query Management
   *
   * These useEffect hooks manage the state of which NFT query (cached or updated) to use.
   *
   * The first useEffect switches to the updated query when it successfully completes.
   * This ensures we use the most recent data from the server when available.
   *
   * The second useEffect switches back to the cached query if it has been updated more recently
   * than the updated query. This can happen if local changes are made: they are the most recent
   * and the cached from the server will reflect these changes.
   *
   * Together, these hooks ensure we always display the most up-to-date NFT information available,
   * balancing between server-side updates and local cache updates.
   ************************************************************************************************/
  useEffect(() => {
    if (updatedQuery.isSuccess && !useUpdatedQuery) {
      set_useUpdatedQuery(true);
    }
  }, [updatedQuery.isSuccess, useUpdatedQuery]);

  useEffect(() => {
    if (cachedQuery.dataUpdatedAt > updatedQuery.dataUpdatedAt) {
      set_useUpdatedQuery(false);
    }
  }, [cachedQuery.dataUpdatedAt, updatedQuery.dataUpdatedAt, useUpdatedQuery]);

  /************************************************************************************************
   * This section processes and transforms the NFT data for use in the component.
   *
   * - mostUpToDateQuery: Selects the most recent query data (updated or cached).
   * - progressInPercents: Converts the progress from a decimal to a percentage.
   * - colorToColorName: Maps the numeric color value to a color name using the colorDict.
   ************************************************************************************************/
  const mostUpToDateQuery = useUpdatedQuery ? updatedQuery : cachedQuery;
  const progressInPercents = Math.round(
    parseFloat(mostUpToDateQuery.data?.progress ?? '0.00') * 100,
  ) as TProgress;
  const colorToColorName =
    colorDict[parseInt(mostUpToDateQuery.data?.color ?? '0')];

  return {
    nft: {
      ...mostUpToDateQuery.data,
      color: colorToColorName,
      progress: progressInPercents,
    },
    hasNFT: Boolean(cachedQuery.data),
    isLoading: cachedQuery.isPending,
    error: cachedQuery.error,
    refetch: cachedQuery.refetch,
  };
}
