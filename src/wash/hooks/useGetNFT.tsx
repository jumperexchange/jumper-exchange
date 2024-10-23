import { useCallback, useEffect, useState } from 'react';
import { useUmi } from '../contexts/useUmi';
import { colorDict, WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useQuery } from '@tanstack/react-query';

import type { TColor } from '../utils/theme';
import type { TNFTItem } from '../types/types';

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

export function useGetNFT(refetchUser?: VoidFunction): TGetNFT {
  const [dataRefreshedFor, set_dataRefreshedFor] = useState<string | undefined>(
    undefined,
  );
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { umi } = useUmi();

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
  const fetchUpdatedNFT = useCallback(async (): Promise<void> => {
    await fetch(
      `${WASH_ENDPOINT_ROOT_URI}/lifi/${umi?.identity.publicKey}/update-data`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${base58.serialize(account.address ?? '')}`,
        },
      },
    );
    set_dataRefreshedFor(umi?.identity.publicKey);
    cachedQuery.refetch();
    refetchUser?.();
  }, [umi?.identity.publicKey, account.address, cachedQuery, refetchUser]);

  /************************************************************************************************
   * useEffect Hook for Fetching Updated NFT Data
   *
   * This effect is responsible for triggering the fetchUpdatedNFT function when certain
   * conditions are met. It ensures that the NFT data is refreshed when:
   * 1. The Umi instance is available
   * 2. The account is connected
   * 3. The account address is available
   * 4. The Umi public key is available
   * 5. The data hasn't been refreshed for the current public key
   *
   * This approach helps maintain up-to-date NFT information while avoiding unnecessary API calls.
   ************************************************************************************************/
  useEffect(() => {
    if (
      umi &&
      account.isConnected &&
      account.address &&
      umi?.identity.publicKey &&
      dataRefreshedFor !== umi?.identity.publicKey
    ) {
      fetchUpdatedNFT();
    }
  }, [
    fetchUpdatedNFT,
    umi,
    account.isConnected,
    account.address,
    umi?.identity.publicKey,
    dataRefreshedFor,
  ]);

  /************************************************************************************************
   * This section processes and transforms the NFT data for use in the component.
   *
   * - mostUpToDateQuery: Selects the most recent query data (updated or cached).
   * - progressInPercents: Converts the progress from a decimal to a percentage.
   * - colorToColorName: Maps the numeric color value to a color name using the colorDict.
   ************************************************************************************************/
  const progressInPercents = Number(
    (parseFloat(cachedQuery.data?.progress ?? '0.00') * 100).toFixed(2),
  );
  const colorToColorName = colorDict[parseInt(cachedQuery.data?.color ?? '0')];

  return {
    nft: {
      ...cachedQuery.data,
      color: colorToColorName,
      progress: progressInPercents,
    },
    hasNFT: Boolean(cachedQuery.data),
    isLoading: cachedQuery.isPending,
    error: cachedQuery.error,
    refetch: cachedQuery.refetch,
  };
}
