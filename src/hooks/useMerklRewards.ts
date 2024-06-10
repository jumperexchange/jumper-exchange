'use client';
import { MercleNFTABI } from './../const/abi/mercleNftABI';
import { base } from 'wagmi/chains';
import { useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

export interface UseMerklRes {
  activePosition: any;
  availableRewards: any;
}

export interface UseMerklRewardsProps {
  userAddress?: string;
}

const JUMPER_QUEST_ID = [];

const MEKRL_API = 'https://api.merkl.xyz/v3';

export const useMerklRewards = ({
  userAddress,
}: UseMerklRewardsProps): UseMerklRes => {
  // In this readContract call, we enforce the type as 0xstring to adhere to the viem type,
  // and we ensure the variable isn't undefined due to the check within enabled
  const tokenId = useReadContract({
    abi: MercleNFTABI,
    address: MERCLE_ADDRESS,
    functionName: 'getActiveTokenId',
    args: [userAddress as `0xstring`],
    chainId: base.id,
    query: {
      enabled: !!userAddress,
    },
  });
  const id = tokenId.data as bigint;

  // Call to get the active positions
  // Call to get the available rewards

  //   const tokenUri = useReadContract({
  //     abi: MercleNFTABI,
  //     address: MERCLE_ADDRESS,
  //     functionName: 'tokenURI',
  //     args: [id],
  //     chainId: base.id,
  //     query: {
  //       enabled: !!id,
  //     },
  //   });
  //   const uri = tokenUri?.data as string;

  //   const { data } = useQuery({
  //     queryKey: ['mercleNFT'],
  //     queryFn: async () => {
  //       const response = await fetch(uri);
  //       const result = await response.json();
  //       return result.image;
  //     },
  //     refetchInterval: 1000 * 60 * 60,
  //     enabled: !!uri,
  //   });

  return {
    activePosition: {},
    availableRewards: {},
  };
};
