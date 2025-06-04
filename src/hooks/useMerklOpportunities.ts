'use client';
import { useQuery } from '@tanstack/react-query';
import { CTALinkInt } from 'src/components/QuestPage/CTA/MissionCTA';
import { MerklOpportunity } from 'src/types/merkl';

const MERKL_API = 'https://api.merkl.xyz/v4';
const CACHE_TIME = 1000 * 60 * 60; // 1 hour
const STALE_TIME = 1000 * 60 * 5; // 5 minutes

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
          // if campaignId is provided, filter opportunities by campaignId
          const response = await fetch(
            `${MERKL_API}/opportunities?campaignId=${campaignId}`,
            {
              next: {
                revalidate: 3600, // Revalidate every hour
                tags: [
                  'merkl-opportunities',
                  `merkl-opportunities-${campaignId}`,
                ], // Tag for manual revalidation
              },
            },
          );
          if (!response.ok) {
            throw new Error(`Merkl API error: ${response.status}`);
          }
          const result = await response.json();
          return result as MerklOpportunity;
        } else {
          // else if rewardsIds is provided, search for opportunities by rewardsId
          const opportunities = await Promise.all(
            rewardsIds.map(async (rewardsId) => {
              if (!rewardsId) return null;
              const response = await fetch(
                `${MERKL_API}/opportunities?&search=${rewardsId}`,
                {
                  next: {
                    revalidate: 3600, // Revalidate every hour
                    tags: [
                      'merkl-opportunities',
                      `merkl-opportunities-${rewardsId}`,
                    ], // Tag for manual revalidation
                  },
                },
              );
              if (!response.ok) {
                throw new Error(`Merkl API error: ${response.status}`);
              }
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
    refetchInterval: CACHE_TIME, // Refetch every hour
    staleTime: STALE_TIME, // Consider data stale after 5 minutes
    gcTime: CACHE_TIME, // Keep data in cache for 1 hour
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
  if (data && Array.isArray(data) && data.length === 1 && !!campaignId) {
    const opportunitiesByCampaignId = {
      claimingId: data[0].id,
      apy: data[0].apr,
      logo: data[0].protocol.icon,
      text: data[0].name,
      link: data[0].depositUrl,
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
