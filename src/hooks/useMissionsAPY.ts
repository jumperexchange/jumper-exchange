'use client';
import { useQuery } from '@tanstack/react-query';
import { CTALinkInt } from 'src/components/Superfest/SuperfestPage/CTA/MissionCTA';

const ACTIVE_CHAINS = ['10', '8453', '252', '34443'];
const MERKL_API = 'https://api.merkl.xyz/v3';
const CREATOR_TAG = 'superfest';

interface useMissionsAPYRes {
  isLoading: boolean;
  isSuccess: boolean;
  CTAsWithAPYs: CTALinkInt[];
}

export const useMissionsAPY = (CTAs: CTALinkInt[]): useMissionsAPYRes => {
  const MERKL_CAMPAIGN_API = `${MERKL_API}/campaigns?chainIds=${ACTIVE_CHAINS.join(',')}&creatorTag=${CREATOR_TAG}`;

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['campaignInfo'],
    queryFn: async () => {
      try {
        const response = await fetch(MERKL_CAMPAIGN_API);
        const result = await response.json();
        return result;
      } catch (err) {
        console.log(err);
      }
    },
    enabled: CTAs.length > 0,
    refetchInterval: 1000 * 60 * 60,
  });

  const CTAsWithAPYs = CTAs.map((CTA: CTALinkInt) => {
    for (const id of ACTIVE_CHAINS) {
      const chainCampaignData = data?.[id];
      if (chainCampaignData && chainCampaignData[CTA.claimingId]) {
        for (const [key, data] of Object.entries(
          chainCampaignData[CTA.claimingId],
        )) {
          const timestamp = Date.now() / 1000;
          if (
            data &&
            (data as any).apr &&
            (data as any).endTimestamp > timestamp
          ) {
            return {
              ...CTA,
              apy: (data as any).apr,
            };
          }
        }
      }
    }
    return CTA;
  });

  console.log('-------------');
  console.log(CTAsWithAPYs);

  return {
    CTAsWithAPYs,
    isLoading,
    isSuccess,
  };
};
