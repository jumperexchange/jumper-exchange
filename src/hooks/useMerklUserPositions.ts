'use client';
import { useQuery } from '@tanstack/react-query';

interface UserPosition {
  balance: number;
  token: string;
  origin: string;
  totalSupply: number;
  tvl: number;
}

interface TokenDataPosition {
  userPositions: UserPosition[];
  symbol?: string;
  decimals: number;
  token: string;
  userTVL: number;
  totalSupply?: number;
  tvl?: number;
}

interface MerklPositionData {
  [key: string]: {
    [key: string]: TokenDataPosition;
  };
}

export interface UseMerklUserPositionsRes {
  isSuccess: boolean;
  isLoading: boolean;
  userPositions?: MerklPositionData;
}

export interface UseMerklUserPositionsProps {
  userAddress?: string;
}

const MERKL_API = 'https://api.merkl.xyz/v4';

export const useMerklUserPositions = ({
  userAddress,
}: UseMerklUserPositionsProps): UseMerklUserPositionsRes => {
  const {
    data: userPositionData,
    isSuccess: userPositionIsSuccess,
    isLoading: userPositionIsLoading,
  } = useQuery<MerklPositionData>({
    queryKey: ['MerklUserPositions', userAddress],
    queryFn: async () => {
      const response = await fetch(
        `${MERKL_API}/users/${userAddress}/positions`,
      );
      if (!response.ok) {
        throw new Error(`Merkl API error: ${response.status}`);
      }
      return response.json();
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  return {
    isLoading: userPositionIsLoading,
    isSuccess: userPositionIsSuccess,
    userPositions: userPositionData,
  };
};
