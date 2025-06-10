import { merklApi } from 'src/utils/merkl/merklApi';

interface GetMerklUserRewardsProps {
  userAddress?: string;
  chainIds?: string[];
  claimableOnly?: boolean;
}

export const getMerklUserRewards = async ({
  userAddress,
  chainIds,
  claimableOnly = false,
}: GetMerklUserRewardsProps) => {
  if (!userAddress) {
    return [];
  }

  if (!chainIds) {
    return [];
  }

  try {
    const response = await merklApi
      .users({ address: userAddress })
      .rewards.get({
        query: {
          chainId: chainIds.filter((id) => id !== null),
          breakdownPage: 0,
          claimableOnly,
        },
      });
    if (!response.data || !Array.isArray(response.data)) {
      return [];
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching max APY for identifiers:', error);
    return {};
  }
};
