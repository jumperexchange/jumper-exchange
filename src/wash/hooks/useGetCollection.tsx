import { useCallback } from 'react';
import { useUmi } from '../contexts/useUmi';
import { colorDict, WASH_ENDPOINT_ROOT_URI } from '../utils/constants';
import axios from 'axios';
import { ChainType } from '@lifi/sdk';
import { useAccount } from '@lifi/wallet-management';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useQuery } from '@tanstack/react-query';

import type { TColor } from '../utils/theme';
import type { TNFTItem, TProgress } from '../types/types';

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
  const fetchNftCollection = useCallback(
    async (): Promise<TNftResponse[]> =>
      axios
        .get(
          `${WASH_ENDPOINT_ROOT_URI}/user/${umi?.identity.publicKey}/collection`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${base58.serialize(account.address ?? '')}`, //TODO: CHECK IF NO base58 REQUIRED
            },
          },
        )
        .then((res) => res.data.data),
    [umi, account.address],
  );

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
        const progressInPercents = Math.round(
          parseFloat(nft?.progress ?? '0.00') * 100,
        ) as TProgress;
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
