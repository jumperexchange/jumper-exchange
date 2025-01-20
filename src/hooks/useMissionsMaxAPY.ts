'use client';
import { useQuery } from '@tanstack/react-query';
import {
  MERKL_CREATOR_TAG,
  REWARDS_CHAIN_IDS,
} from 'src/const/partnerRewardsTheme';
import type { MerklApyRes } from './useMissionsAPY';

const ACTIVE_CHAINS = REWARDS_CHAIN_IDS;
const MERKL_API = 'https://api.merkl.xyz/v3';
const CREATOR_TAG = MERKL_CREATOR_TAG;

interface useMissionsAPYRes {
  isLoading: boolean;
  isSuccess: boolean;
  apy: number;
}

export const useMissionsMaxAPY = (
  claimingIds: string[] | undefined,
): useMissionsAPYRes => {
  const MERKL_CAMPAIGN_API = `${MERKL_API}/campaigns?chainIds=${ACTIVE_CHAINS.join(',')}`; //&creatorTag=${CREATOR_TAG}`;

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['accountCampaignInfo'],
    queryFn: async () => {
      try {
        const response = await fetch(MERKL_CAMPAIGN_API);
        const result = await response.json();
        return result;
      } catch (err) {
        console.error(err);
      }
    },
    enabled: claimingIds && claimingIds.length > 0,
    refetchInterval: 1000 * 60 * 60,
  });

  let apy = 0;

  if (claimingIds) {
    for (const id of claimingIds) {
      const timestamp = Date.now() / 1000;

      for (const chainId of ACTIVE_CHAINS) {
        const chainCampaignData = data?.[chainId];
        if (chainCampaignData && chainCampaignData[id]) {
          for (const [, data] of Object.entries(chainCampaignData[id]) as [
            string,
            MerklApyRes,
          ][]) {
            //todo: verify for the quest when several apr
            if (data?.apr && data.endTimestamp > timestamp && data.apr > apy) {
              apy = data.apr;
            }
          }
        }
      }
    }
  }

  return {
    apy,
    isLoading,
    isSuccess,
  };
};
