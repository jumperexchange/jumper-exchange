import { useQuery } from '@tanstack/react-query';
import { LEADERBOARD_LENGTH } from 'src/components/Leaderboard/Leaderboard';

const LEADERBOARD_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard`;

export interface LeaderboardEntryData {
  position: string;
  walletAddress: string;
  points: string;
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

export interface LeaderboardUserDataExtended extends LeaderboardEntryData {
  userPage?: number;
}

export interface LeaderboardUserData {
  data: LeaderboardUserDataExtended;
  isLoading: boolean;
  isSuccess: boolean;
}

export const useLeaderboardList = (
  page: number,
  limit: number,
): {
  data: LeaderboardEntryData[];
  meta: LeaderboardMeta;
  isLoading: boolean;
  isSuccess: boolean;
} => {
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
    refetchInterval: 1000 * 60 * 60,
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
): {
  data: LeaderboardEntryData & { userPage: number };
  isLoading: boolean;
  isSuccess: boolean;
} => {
  const {
    data: leaderboardUserData,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ['leaderboard-user', walletAddress],
    queryFn: getLeaderboardUserQuery,
    refetchInterval: 1000 * 60 * 60,
  });
  const userPage =
    leaderboardUserData?.data &&
    Math.ceil(leaderboardUserData?.data.position / LEADERBOARD_LENGTH);
  const data = { ...leaderboardUserData?.data, userPage };

  return {
    data,
    isLoading,
    isSuccess,
  };
};
