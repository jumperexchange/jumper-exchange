'use client';
import { MercleNFTABI } from './../const/abi/mercleNftABI';
import { base } from 'wagmi/chains';
import { useReadContract } from 'wagmi';
import { useQuery } from '@tanstack/react-query';

export interface UseMercleNftProps {
  imageLink: string;
}

export interface UseMercleProps {
  userAddress?: string;
}

const MERCLE_ADDRESS = '0x50527a3854b76f73e2720955b6ecccfac0c6f473';

export const useMercleNft = ({
  userAddress,
}: UseMercleProps): UseMercleNftProps => {
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

  const tokenUri = useReadContract({
    abi: MercleNFTABI,
    address: MERCLE_ADDRESS,
    functionName: 'tokenURI',
    args: [id],
    chainId: base.id,
    query: {
      enabled: !!id,
    },
  });
  const uri = tokenUri?.data as string;

  const { data } = useQuery({
    queryKey: ['mercleNFT'],
    queryFn: async () => {
      const response = await fetch(uri);
      const result = await response.json();
      return result.image;
    },
    refetchInterval: 1000 * 60 * 60,
    enabled: !!uri,
  });

  return {
    imageLink: data,
  };
};
