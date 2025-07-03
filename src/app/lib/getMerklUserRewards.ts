import * as Sentry from '@sentry/nextjs';
import { merklApi } from 'src/utils/merkl/merklApi';
type MerklUsersRewardsApiResponse = Awaited<
  ReturnType<ReturnType<typeof merklApi.users>['rewards']['get']>
>;
type MerklUsersRewardsResponse = NonNullable<
  MerklUsersRewardsApiResponse['data']
>;
export type MerklUserRewardsData = NonNullable<MerklUsersRewardsResponse[0]>;
export type MerklUserRewards = MerklUserRewardsData['rewards'];
export type MerklUserChains = MerklUserRewardsData['chain'];
interface GetMerklUserRewardsProps {
  userAddress?: string;
  chainIds?: string[];
  claimableOnly?: boolean;
}

export const getMerklUserRewards = async ({
  userAddress,
  chainIds,
  claimableOnly = false,
}: GetMerklUserRewardsProps): Promise<MerklUserRewardsData[]> => {
  if (!userAddress || !chainIds) {
    return [];
  }

  try {
    const response = await merklApi
      .users({ address: userAddress })
      .rewards.get({
        query: {
          chainId: chainIds.filter((chainId) => Boolean(chainId)),
          breakdownPage: 0,
          claimableOnly,
        },
      });
    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }
    return response.data;
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error fetching max APY for identifiers:', error);
    return [];
  }
};
