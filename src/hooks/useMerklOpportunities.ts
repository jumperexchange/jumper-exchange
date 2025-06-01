'use client';
import { useQuery } from '@tanstack/react-query';
import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';
import { REWARDS_CHAIN_IDS } from 'src/const/partnerRewardsTheme';
import { MerklOpportunity } from 'src/types/merkl';

const MERKL_API = 'https://api.merkl.xyz/v4';

interface UseMerklOpportunitiesRes {
  isLoading: boolean;
  isSuccess: boolean;
  data: CTALinkInt[];
}

interface UseMerklOpportunitiesProps {
  rewardsIds?: string[];
  campaignId?: string;
}

// Add this type to represent the possible return types from the query
type MerklQueryResult = MerklOpportunity | MerklOpportunity[];

export const useMerklOpportunities = ({
  rewardsIds = [],
  campaignId,
}: UseMerklOpportunitiesProps): UseMerklOpportunitiesRes => {
  const { data, isSuccess, isLoading } = useQuery<MerklQueryResult>({
    queryKey: ['merklOpportunities', campaignId ?? rewardsIds],
    queryFn: async () => {
      try {
        if (campaignId) {
          const response = await fetch(
            `${MERKL_API}/opportunities/${campaignId}`,
          );
          const result = await response.json();
          return result as MerklOpportunity;
        } else {
          const opportunities = await Promise.all(
            rewardsIds.map(async (rewardsId) => {
              if (!rewardsId) return null;
              const response = await fetch(
                `${MERKL_API}/opportunities?chainId=${REWARDS_CHAIN_IDS[0]}&search=${rewardsId}`,
              );
              const result = await response.json();
              return result as MerklOpportunity[];
            }),
          );
          return opportunities.flat().filter(Boolean) as MerklOpportunity[];
        }
      } catch (err) {
        console.error('Error fetching Merkl opportunities:', err);
        return [];
      }
    },
    enabled: !!campaignId || rewardsIds.length > 0,
    refetchInterval: 1000 * 60 * 60, // Refetch every hour
  });

  if (rewardsIds.length > 0 && data && Array.isArray(data)) {
    const opportunitiesByRewardsIds = rewardsIds
      .map((rewardsId: string) => {
        const opportunity = data.find((opp) =>
          opp.aprRecord?.breakdowns?.some(
            (breakdown) => breakdown.identifier === rewardsId,
          ),
        );
        if (opportunity) {
          return {
            claimingId: rewardsId,
            apy: opportunity.apr,
            logo: opportunity.protocol.icon,
            text: opportunity.name,
            link: opportunity.depositUrl,
          };
        }
      })
      .filter((el) => !!el);

    return {
      data: opportunitiesByRewardsIds,
      isLoading,
      isSuccess,
    };
  }

  // Type guard to check if data is a single object
  if (data && !Array.isArray(data)) {
    const opportunitiesByCampaignId = {
      claimingId: data.id,
      apy: data.apr,
      logo: data.protocol.icon,
      text: data.name,
      link: data.depositUrl,
    };

    return {
      data: [opportunitiesByCampaignId],
      isLoading,
      isSuccess,
    };
  }

  return {
    data: [],
    isLoading,
    isSuccess,
  };
};
