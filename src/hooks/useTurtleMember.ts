import { useQuery } from '@tanstack/react-query';

interface UseTurtleProps {
  userAddress?: string;
}

interface UseTurtleRes {
  isMember?: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

export const useTurtleMember = ({
  userAddress,
}: UseTurtleProps): UseTurtleRes => {
  const TURTLE_CHECK_API = `https://points.turtle.club/user/${userAddress}/exists`;

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['turtleMemberCheck'],
    queryFn: async () => {
      try {
        const response = await fetch(TURTLE_CHECK_API);
        const result = await response.text();
        console.log(result);
        if (result) {
          return result === 'true';
        }
        return false;
      } catch (err) {
        console.log(err);
      }
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  return { isMember: data, isSuccess, isLoading };
};
