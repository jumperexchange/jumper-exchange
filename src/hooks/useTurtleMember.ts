import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { exists, defaultConfig } from '@turtledev/api';
import { JUMPER_REFERRAL } from 'src/const/quests';

interface UseTurtleProps {
  userAddress?: string;
}

interface UseTurtleRes {
  isMember?: boolean;
  isJumperMember?: boolean;
  refetchMember: UseQueryResult['refetch'];
  refetchJumperMember: UseQueryResult['refetch'];
  isLoading: boolean;
  isSuccess: boolean;
}

export const useTurtleMember = ({
  userAddress,
}: UseTurtleProps): UseTurtleRes => {
  const {
    data: isMember,
    isSuccess: isMemberSuccess,
    isLoading: isMemberLoading,
    refetch: refetchMember,
  } = useQuery({
    queryKey: ['turtleMemberCheck', userAddress],
    queryFn: async () => {
      try {
        if (!userAddress) {
          return false;
        }

        const existsOptions = {
          user: userAddress,
        };

        return await exists(existsOptions, defaultConfig);
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
    refetch: refetchRefCheck,
  } = useQuery({
    queryKey: ['turtleMemberRefCheck', userAddress],
    queryFn: async () => {
      try {
        // @Note: Seems @turtledev/api doesn't have a direct method for referral check, so we make a fetch call
        const response = await fetch(
          `${defaultConfig.pointsEndpoint}/referral/${userAddress}`,
        );
        const result = await response.json();
        if (result && result.used_referral) {
          return result.used_referral === JUMPER_REFERRAL;
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
    isMember,
    isJumperMember: refCheck,
    refetchMember,
    refetchJumperMember: refetchRefCheck,
    isSuccess: isMemberSuccess && refCheckIsSuccess,
    isLoading: isMemberLoading && refCheckIsLoading,
  };
};
