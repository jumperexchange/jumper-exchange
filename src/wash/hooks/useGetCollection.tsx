import { useCallback } from 'react';
import { useUmi } from '../contexts/useUmi';
import { colorDict, WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { useQuery } from '@tanstack/react-query';

import type { TColor } from '../utils/theme';
import type { TNFTItem } from '../types/types';

type TNftResponse = {
  imageUri: string;
  name: string;
  progress: string;
  color: TColor;
  isRare?: boolean;
  isRevealed?: boolean;
};

export type TGetCollection = {
  collection?: TNFTItem[];
  isLoading: boolean;
  error: Error | null;
  refetch?: VoidFunction;
  hasCollection: boolean;
};

export function useGetCollection(): TGetCollection {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { umi } = useUmi();
  const fetchNftCollection = useCallback(async (): Promise<TNftResponse[]> => {
    const response = await fetch(
      `${WASH_ENDPOINT_ROOT_URI}/user/${umi?.identity.publicKey}/collection`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    const result = await response.json();
    return result.data;
  }, [umi?.identity.publicKey]);

  const {
    isPending,
    error,
    data: collection,
    refetch,
  } = useQuery({
    queryKey: ['collection'],
    queryFn: fetchNftCollection,
    enabled: Boolean(umi && account.isConnected && account.address),
  });

  const updatedCollection = collection?.length
    ? collection?.map((nft) => {
        const progressInPercents = Number(
          (parseFloat(nft?.progress ?? '0.00') * 100).toFixed(2),
        );
        const colorToColorName = colorDict[parseInt(nft?.color ?? '0')];

        return {
          ...nft,
          progress: progressInPercents,
          color: colorToColorName,
        };
      })
    : [];

  return {
    collection: updatedCollection,
    isLoading: isPending,
    hasCollection: Boolean(collection),
    error,
    refetch,
  };
}
