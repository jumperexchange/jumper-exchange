import { useQuery } from '@tanstack/react-query';
import { ChainType, getChains } from '@lifi/sdk';

const LEADERBOARD_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`;

export interface LeaderboardEntryData {
  position: number;
  walletAddress: string;
  points: number;
}

export interface LeaderboardMeta {
  pagination: {
    pagesLength: number;
  };
}

export interface LeaderboardListData {
  data: LeaderboardEntryData[];
  meta: LeaderboardMeta;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface LeaderboardUserData {
  data: LeaderboardEntryData;
  isLoading: boolean;
  isSuccess: boolean;
}

export const useLeaderboardList = (
  page: number,
  limit: number,
): LeaderboardListData => {
  const {
    data: leaderboardListData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: [`leaderboard-${page}-${limit}`],
    queryFn: async () => {
      try {
        const response = await fetch(
          `${LEADERBOARD_ENDPOINT}?page=${page}&limit=${limit}`,
        );
        const result = await response.json();
        return result;
      } catch (err) {
        console.error(err);
      }
    },
  });

  const data = leaderboardListData?.data;
  const meta = leaderboardListData?.meta;

  return {
    data,
    meta,
    isLoading,
    isSuccess,
  };
};

export async function getLeaderboardUserQuery({
  queryKey,
}: {
  queryKey: (string | undefined)[];
}) {
  const walletAddress = queryKey[1];
  if (!walletAddress) {
    return {
      data: null,
      isLoading: false,
      isSuccess: false,
    };
  }
  try {
    const response = await fetch(`${LEADERBOARD_ENDPOINT}/${walletAddress}`);
    const result = await response.json();
    return result;
  } catch (err) {
    console.error(err);
  }
}

export const useLeaderboardUser = (
  walletAddress?: string,
): LeaderboardUserData => {
  const {
    data: leaderboardUserData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['leaderboard-user', walletAddress],
    queryFn: getLeaderboardUserQuery,
  });

  const data = leaderboardUserData?.data;

  return {
    data,
    isLoading,
    isSuccess,
  };
};
