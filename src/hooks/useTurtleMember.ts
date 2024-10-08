import { useQuery } from '@tanstack/react-query';

interface UseTurtleProps {
  userAddress?: string;
}

interface UseTurtleRes {
  isMember?: boolean;
  isJumperMember?: boolean;
  isLoading: boolean;
  isSuccess: boolean;
}

const JUMPER_REF = 'JUMPER';

export const useTurtleMember = ({
  userAddress,
}: UseTurtleProps): UseTurtleRes => {
  const TURTLE_CHECK_API = `https://points.turtle.club/user/${userAddress}/exists`;
  const TURTLE_REFCHECK_API = `https://points.turtle.club/referral/${userAddress}`;

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['turtleMemberCheck'],
    queryFn: async () => {
      try {
        const response = await fetch(TURTLE_CHECK_API);
        const result = await response.text();
        if (result) {
          return result === 'true';
        }
        return false;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60,
  });

  const {
    data: refCheck,
    isSuccess: refCheckIsSuccess,
    isLoading: refCheckIsLoading,
  } = useQuery({
    queryKey: ['turtleMemberRefCheck'],
    queryFn: async () => {
      try {
        const response = await fetch(TURTLE_REFCHECK_API);
        const result = await response.json();
        if (result && result.used_referral) {
          return result.used_referral === JUMPER_REF;
        }
        return false;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    enabled: !!userAddress,
    refetchInterval: 1000 * 60 * 60 * 2,
  });

  return {
    isMember: data,
    isJumperMember: refCheck,
    isSuccess: isSuccess && refCheckIsSuccess,
    isLoading: isLoading && refCheckIsLoading,
  };
};
