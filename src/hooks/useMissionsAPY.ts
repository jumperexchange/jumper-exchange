'use client';
import { useQuery } from '@tanstack/react-query';
import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';

const MERKL_API = 'https://api.merkl.xyz/v3';

interface useMissionsAPYRes {
  isLoading: boolean;
  isSuccess: boolean;
  CTAsWithAPYs: CTALinkInt[];
}

export interface MerklApyRes {
  apr: number;
  endTimestamp: number;
}

export const useMissionsAPY = (CTAs: CTALinkInt[] = []): useMissionsAPYRes => {
  const MERKL_CAMPAIGN_API = `${MERKL_API}/campaigns?chainIds=${REWARDS_CHAIN_IDS.join(',')}`; //&creatorTag=${CREATOR_TAG}  const { data, isSuccess, isLoading } = useQuery({
  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['campaignInfo'],
    queryFn: async () => {
      try {
        const response = await fetch(MERKL_CAMPAIGN_API);
        const result = await response.json();
        return result;
      } catch (err) {
        console.error(err);
      }
    },
    enabled: CTAs.length > 0,
    refetchInterval: 1000 * 60 * 60,
  });

  const CTAsWithAPYs = CTAs.map((CTA: CTALinkInt) => {
    const timestamp = Date.now() / 1000;

    for (const id of REWARDS_CHAIN_IDS) {
      const chainCampaignData = data?.[id];
      if (chainCampaignData && chainCampaignData[CTA.claimingId]) {
        for (const [, data] of Object.entries(
          chainCampaignData[CTA.claimingId],
        ) as [string, MerklApyRes][]) {
          if (data?.apr && data.endTimestamp > timestamp) {
            return {
              ...CTA,
              apy: data.apr,
            };
          }
        }
      }
    }
    return CTA;
  });

  return {
    CTAsWithAPYs,
    isLoading,
    isSuccess,
  };
};
