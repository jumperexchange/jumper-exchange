import { useQuery } from '@tanstack/react-query';
import { exists, defaultConfig } from '@turtledev/api';

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
  const {
    data: isMember,
    isSuccess: isMemberSuccess,
    isLoading: isMemberLoading,
  } = useQuery({
    queryKey: ['turtleMemberCheck'],
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
  } = useQuery({
    queryKey: ['turtleMemberRefCheck'],
    queryFn: async () => {
      try {
        // @Note: Seems @turtledev/api doesn't have a direct method for referral check, so we make a fetch call
        const response = await fetch(
          `${defaultConfig.pointsEndpoint}/referral/${userAddress}`,
        );
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
    isMember,
    isJumperMember: refCheck,
    isSuccess: isMemberSuccess && refCheckIsSuccess,
    isLoading: isMemberLoading && refCheckIsLoading,
  };
};
