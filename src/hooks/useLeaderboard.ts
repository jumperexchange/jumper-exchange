'use client';
import { useQuery } from '@tanstack/react-query';

const LEADERBOARD_ENDPOINT = `${process.env.NEXT_PUBLIC_BACKEND_URL}/leaderboard?page=1&limit=25`;

// interface useMissionsAPYRes {
//   isLoading: boolean;
//   isSuccess: boolean;
// }

export const useLeaderboard = (walletAddress?: string): any => {

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['campaignInfo'],
    queryFn: async () => {
      try {
        const response = await fetch(LEADERBOARD_ENDPOINT);
        const result = await response.json();
        return result;
      } catch (err) {
        console.log(err);
      }
    },
  });

  const leaderboardData = data?.data;

  return {
    data: leaderboardData,
    isLoading,
    isSuccess,
  };
};
